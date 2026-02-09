const axios = require('axios');

async function testRegister() {
    const testUser = {
        name: 'Test User ' + Date.now(),
        email: `test_user_${Date.now()}@example.com`, // Use a fake email, it might fail SendGrid if not a real address but we will see the API response
        password: 'password123'
    };

    console.log('Attempting to register with:', testUser);

    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
        console.log('✅ Registration Status:', response.status);
        console.log('✅ Response Body:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Registration Failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Install axios if not present or just use fetch if node 18+
// For safety, I'll use native fetch (available in Node 18+)
// Rewriting to use fetch for zero-dependency

(async () => {
    const testUser = {
        name: 'Test User ' + Date.now(),
        email: `test_user_${Date.now()}@example.com`,
        password: 'password123'
    };

    console.log('Attempting to register with:', testUser);

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
})();
