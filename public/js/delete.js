const deleteBlogPost = async (event) => {
    event.preventDefault();
  
    const blogpostId = window.location.pathname.split("/")[3];

    console.log(blogpostId);

    const response = await fetch(`/dashboard/deleteblogpost/${blogpostId}`, {
        method: "DELETE",
    });

    if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        alert('Failed to add blogpost.');
      }
    };

  document
  .querySelector('#delete-blogpost')
  .addEventListener('click', deleteBlogPost);