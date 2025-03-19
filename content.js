// YouTube livestream URLs
const videos = [
    'https://www.youtube.com/embed/eBNyINb-Be4?autoplay=1', // Waima Bay
    'https://www.youtube.com/embed/B4-L2nfGcuE?autoplay=1', // Big Bear Bald Eagle
    'https://www.youtube.com/embed/4ElanH9Gzjw?autoplay=1', // Sea Lions
    'https://www.youtube.com/embed/VI8Wj5EwoRM?autoplay=1', // Banzai
    'https://www.youtube.com/embed/jJI5w_RVGtQ?autoplay=1'  // Your new livestream
  ];
  
  // Function to show popups
  function showPopups() {
    console.log("Showing popups...");
    
    // Remove any existing popups first
    document.querySelectorAll('.youtube-popup').forEach(el => el.remove());
    
    // Create popups for each video
    videos.forEach(function(url, index) {
      const popup = document.createElement('div');
      popup.className = 'youtube-popup';
      popup.style.position = 'fixed';
      popup.style.zIndex = '10000';
      popup.style.width = '320px';
      popup.style.height = '240px';
      popup.style.top = (50 + (index % 2) * 260) + 'px'; // Two columns
      popup.style.left = (50 + Math.floor(index / 2) * 340) + 'px'; // Two rows
      popup.style.boxShadow = '0 0 10px black';
      popup.style.backgroundColor = '#000';
      popup.style.borderRadius = '8px';
      popup.style.overflow = 'hidden';
      
      // Create a header/drag handle for the popup
      const header = document.createElement('div');
      header.className = 'popup-header';
      header.style.height = '25px';
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      header.style.cursor = 'move';
      header.style.position = 'absolute';
      header.style.top = '0';
      header.style.left = '0';
      header.style.right = '0';
      header.style.zIndex = '10001';
      
      // Add event listeners for dragging
      let isDragging = false;
      let offsetX, offsetY;
      
      header.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
        
        // Add a temporary transparent overlay to prevent iframe from capturing mouse events during drag
        const overlay = document.createElement('div');
        overlay.className = 'drag-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);
        
        function movePopup(e) {
          if (!isDragging) return;
          
          const newLeft = e.clientX - offsetX;
          const newTop = e.clientY - offsetY;
          
          // Keep window within viewport bounds
          const maxX = window.innerWidth - popup.offsetWidth;
          const maxY = window.innerHeight - popup.offsetHeight;
          
          popup.style.left = Math.max(0, Math.min(newLeft, maxX)) + 'px';
          popup.style.top = Math.max(0, Math.min(newTop, maxY)) + 'px';
        }
        
        function stopDragging() {
          isDragging = false;
          document.removeEventListener('mousemove', movePopup);
          document.removeEventListener('mouseup', stopDragging);
          
          // Remove the overlay
          const overlay = document.querySelector('.drag-overlay');
          if (overlay) overlay.remove();
        }
        
        document.addEventListener('mousemove', movePopup);
        document.addEventListener('mouseup', stopDragging);
      });
      
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.style.marginTop = '25px'; // Make room for the header
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      
      const closeBtn = document.createElement('div');
      closeBtn.textContent = 'X';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '3px';
      closeBtn.style.right = '5px';
      closeBtn.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
      closeBtn.style.color = 'white';
      closeBtn.style.padding = '1px 6px';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.zIndex = '10002';
      closeBtn.style.fontWeight = 'bold';
      closeBtn.style.fontSize = '14px';
      closeBtn.onclick = function(e) {
        e.stopPropagation();
        popup.remove();
      };
      
      // Add a title to the header
      const title = document.createElement('div');
      title.textContent = 'YouTube Stream ' + (index + 1);
      title.style.color = 'white';
      title.style.fontSize = '12px';
      title.style.position = 'absolute';
      title.style.left = '10px';
      title.style.top = '5px';
      
      header.appendChild(title);
      popup.appendChild(header);
      popup.appendChild(iframe);
      popup.appendChild(closeBtn);
      document.body.appendChild(popup);
      
      console.log("Added popup for: " + url);
    });
  }
  
  // Check if chrome.runtime exists before using it
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    // Listen for messages from popup.js
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      console.log("Received message:", message);
      
      if (message.action === 'showPopups') {
        showPopups();
        sendResponse({status: 'Popups created successfully'});
      }
      return true;
    });
  
    console.log("Message listener set up successfully");
  } else {
    console.log("chrome.runtime.onMessage not available");
  }
  
  // For testing - show popups with keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'p') {
      console.log("Alt+P pressed, showing popups");
      showPopups();
    }
  });
  
  // Log that content script has loaded
  console.log("YouTube popup content script loaded");