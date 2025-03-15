document.addEventListener('DOMContentLoaded', function() {
  const tools = ['line', 'circle', 'rectangle', 'freehand'];
  const colorPicker = document.getElementById('color');
  
  // Restore last selected color when popup opens
  chrome.storage.local.get(['selectedColor'], function(result) {
    if (result.selectedColor) {
      colorPicker.value = result.selectedColor;
      currentColor = result.selectedColor;
    }
  });

  let currentColor = colorPicker.value;
  
  // Add color picker event listener
  colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    // Save the selected color
    chrome.storage.local.set({ selectedColor: currentColor });
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      try {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'setColor',
          color: currentColor
        }).catch(error => {
          console.log('Error sending color:', error);
        });
      } catch (error) {
        console.log('Error in color setting:', error);
      }
    });
  });
  
  // Restore active tool if any
  chrome.storage.local.get(['activeTool'], function(result) {
    if (result.activeTool) {
      const tool = result.activeTool;
      tools.forEach(t => document.getElementById(t).classList.remove('active'));
      document.getElementById(tool).classList.add('active');
    }
  });

  tools.forEach(tool => {
    document.getElementById(tool).addEventListener('click', () => {
      // Update active button first
      tools.forEach(t => document.getElementById(t).classList.remove('active'));
      document.getElementById(tool).classList.add('active');
      
      // Save active tool
      chrome.storage.local.set({ activeTool: tool });

      // Send message to content script with both tool and color
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        try {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'setTool',
            tool: tool,
            color: currentColor
          }).catch(error => {
            console.log('Error sending message:', error);
            // Reload the content script if connection failed
            chrome.tabs.reload(tabs[0].id);
          });
        } catch (error) {
          console.log('Error in message sending:', error);
        }
      });
    });
  });

  document.getElementById('clear').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      try {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'clear'})
          .catch(error => {
            console.log('Error sending message:', error);
            chrome.tabs.reload(tabs[0].id);
          });
      } catch (error) {
        console.log('Error in message sending:', error);
      }
    });
  });
});
