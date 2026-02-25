/**
 * Test utility to verify image upload and localStorage persistence
 * Run in browser console to debug
 */

export const testImageUploadFlow = async () => {
  console.log('🧪 Starting Image Upload Flow Test...\n');
  
  // Test 1: Check localStorage access
  console.log('✅ Test 1: localStorage access');
  try {
    localStorage.setItem('test_key', 'test_value');
    const value = localStorage.getItem('test_key');
    console.log('  - localStorage is accessible');
    localStorage.removeItem('test_key');
  } catch (error) {
    console.error('  ❌ localStorage error:', error);
    return;
  }

  // Test 2: Check blog data structure
  console.log('\n✅ Test 2: Blog data structure');
  try {
    const blogsData = localStorage.getItem('nexus_blogs');
    if (blogsData) {
      const blogs = JSON.parse(blogsData);
      console.log(`  - Found ${blogs.length} blogs in storage`);
      if (blogs.length > 0) {
        console.log('  - Sample blog keys:', Object.keys(blogs[0]));
        const hasImg = blogs[0].img ? '✓ img field present' : '✗ img field missing';
        console.log(`  - ${hasImg}`);
      }
    } else {
      console.log('  - No blogs in storage yet');
    }
  } catch (error) {
    console.error('  ❌ Error reading blogs:', error);
  }

  // Test 3: Check events data structure
  console.log('\n✅ Test 3: Event data structure');
  try {
    const eventsData = localStorage.getItem('nexus_events');
    if (eventsData) {
      const events = JSON.parse(eventsData);
      console.log(`  - Found ${events.length} events in storage`);
      if (events.length > 0) {
        console.log('  - Sample event keys:', Object.keys(events[0]));
        const hasImg = events[0].img ? '✓ img field present' : '✗ img field missing';
        console.log(`  - ${hasImg}`);
      }
    } else {
      console.log('  - No events in storage yet');
    }
  } catch (error) {
    console.error('  ❌ Error reading events:', error);
  }

  // Test 4: Check storage size
  console.log('\n✅ Test 4: Storage Size Analysis');
  try {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = localStorage.getItem(key)?.length || 0;
        totalSize += size;
        console.log(`  - ${key}: ${(size / 1024).toFixed(2)} KB`);
      }
    }
    console.log(`\n  📊 Total localStorage used: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`  📊 Remaining (approx 5MB limit): ${((5 - totalSize / (1024 * 1024))).toFixed(2)} MB`);
  } catch (error) {
    console.error('  ❌ Error calculating storage:', error);
  }

  console.log('\n✨ Test complete!');
};

// Simulate adding a blog with image
export const simulateAddBlogWithImage = async () => {
  console.log('📝 Simulating blog creation with image...\n');
  
  // Create a small test image (1x1 pixel transparent PNG)
  const smallPNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  try {
    const blogsData = localStorage.getItem('nexus_blogs');
    let blogs = blogsData ? JSON.parse(blogsData) : [];
    
    const newBlog = {
      id: 'test_' + Date.now(),
      title: 'Test Blog with Image',
      author: 'Test User',
      category: 'Testing',
      content: 'This is a test blog post',
      img: smallPNG, // Base64 image
      excerpt: 'Test excerpt',
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    blogs.push(newBlog);
    localStorage.setItem('nexus_blogs', JSON.stringify(blogs));
    
    console.log('✅ Test blog created successfully');
    console.log('   ID:', newBlog.id);
    console.log('   Image size:', (newBlog.img.length / 1024).toFixed(2), 'KB');
    
  } catch (error) {
    console.error('❌ Error creating test blog:', error);
  }
};

console.log('Test utilities loaded. Available functions:');
console.log('  - testImageUploadFlow()  : Run full diagnostic');
console.log('  - simulateAddBlogWithImage() : Test blog + image storage');
