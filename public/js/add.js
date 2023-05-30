const blogPostFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#add-blogpost-title').value.trim()
  const content = document.querySelector('#add-blogpost-content').value.trim();

  if (title && content) {
    const response = await fetch('/dashboard/addblogpost', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert('Failed to add blogpost.');
    }
  }
};

document
.querySelector('#add-blogpost')
.addEventListener('click', blogPostFormHandler);
