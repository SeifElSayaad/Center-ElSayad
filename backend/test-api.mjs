async function testApi() {
  try {
    console.log('Testing GET /categories...');
    const catRes = await fetch('http://localhost:3000/categories');
    console.log('Categories Status:', catRes.status);
    const catBody = await catRes.json();
    console.log('Categories Data Length:', catBody.length || 0);

    console.log('\nTesting GET /products...');
    const prodRes = await fetch('http://localhost:3000/products');
    console.log('Products Status:', prodRes.status);
    const prodBody = await prodRes.json();
    console.log('Products Data Length:', prodBody.length || 0);

    console.log('\nTesting POST /products (Without Auth)...');
    const postRes = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Product', categoryId: 'dummy' })
    });
    console.log('POST no auth Status:', postRes.status);
    console.log('POST no auth body:', await postRes.text());

    console.log('\nAll basic tests finished successfully.');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testApi();
