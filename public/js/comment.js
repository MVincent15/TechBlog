const commentFormHandler = async (event) => {
    event.preventDefault();
  
    const content = document.querySelector('#comment-content').value.trim();
    const blogpostId = window.location.pathname.split("/")[2]; // retrieve the blogpost ID from the current URL
  
    if (content) {
      const response = await fetch(`/blogpost/${blogpostId}/addcomment`, {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/blogpost/${blogpostId}`);
      } else {
        alert('Failed to add comment.');
      }
    }
  };

  document
  .querySelector('#add-comment')
  .addEventListener('click', commentFormHandler);