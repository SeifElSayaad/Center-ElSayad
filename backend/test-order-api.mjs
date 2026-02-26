async function testOrdersApi() {
  try {
    // 1. We need a token to test this, so let's log in as a regular user
    console.log('Logging in as a test user...');
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testb2c@example.com', password: 'password123' }),
    });
    
    // If login fails, we need to register first
    let token = '';
    if (loginRes.status !== 200) {
      console.log('Login failed, registering a new user...');
      const regRes = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'testb2c@example.com', 
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        }),
      });
      const regData = await regRes.json();
      token = regData.token;
      console.log('Registration successful, token received.');
    } else {
      const loginData = await loginRes.json();
      token = loginData.token;
      console.log('Login successful, token received.');
    }

    // 2. Fetch a product to order
    console.log('\nFetching products to get a valid product ID...');
    const prodRes = await fetch('http://localhost:3000/products');
    const products = await prodRes.json();
    
    if (!products || products.length === 0) {
      console.log('No products found to order. Seed the database first!');
      return;
    }
    
    const product = products[0];
    console.log(`Will order product: ${product.name} (ID: ${product.id})`);

    // 3. Create a mock order 
    // The schema requires a valid addressId. Let's create an address directly in DB.
    console.log('\nCreating a dummy address...');
    
    // We can cheat here by directly using prisma in the test script or making a raw fetch request.
    // However, we don't have an address API yet. We will just use raw Prisma in the test file.
    let createdAddressId = '';
    
    // For a cleaner test, we'll try to get the user credentials first from jwt token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const userId = JSON.parse(jsonPayload).userId;

    const dotenv = await import('dotenv');
    dotenv.config();
    const prismaModule = await import('./src/lib/prisma.ts');
    const prisma = prismaModule.default;
    
    const dummyAddress = await prisma.address.create({
      data: {
        userId: userId,
        fullName: 'Test User',
        phone: '1234567890',
        street: '123 Test St',
        city: 'Test City',
      }
    });
    createdAddressId = dummyAddress.id;
    console.log(`Created dummy address ID: ${createdAddressId}`);

    console.log('\nAttempting to create an order...');
    const orderRes = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        addressId: createdAddressId,
        items: [{ productId: product.id, quantity: 1 }]
      })
    });
    
    console.log('Create Order Status:', orderRes.status);
    const orderBody = await orderRes.text();
    console.log('Create Order Response:', orderBody);

    // 4. Fetch User Orders
    console.log('\nFetching User Orders...');
    const getRes = await fetch('http://localhost:3000/orders', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Get Orders Status:', getRes.status);
    const getBody = await getRes.json();
    console.log(`Found ${getBody.length || 0} orders.`);

  } catch (err) {
    console.error('Test failed:', err);
  }
}

testOrdersApi();
