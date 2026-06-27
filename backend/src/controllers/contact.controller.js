const { Contact } = require('../models');

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Create new contact entry
    const newContact = await Contact.create({
      userId: req.user ? req.user.id : null,
      name,
      email,
      subject,
      message,
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Pesan berhasil terkirim',
      data: newContact
    });
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

const getContacts = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows } = await Contact.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

const markContactRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
    }

    contact.status = 'read';
    await contact.save();

    res.json({ success: true, message: 'Pesan telah ditandai dibaca' });
  } catch (error) {
    console.error('Mark Contact Read Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
    }

    await contact.destroy();
    res.json({ success: true, message: 'Pesan berhasil dihapus' });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  createContact,
  getContacts,
  markContactRead,
  deleteContact
};
