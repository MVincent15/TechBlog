const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const post_content = document.querySelector('textarea[name="post-content"]').value.trim();


  const response = await fetch(`/api/posts`, {
    method: 'POST',
    body: JSON.stringify({ title, post_content }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert('Failed to create post');
  }
};

const createPostHandler = async (event) => {
  event.preventDefault();

  document.location.replace('/dashbaord/new')
};


document
  .querySelector('.new-post-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('#create-new-post')
  .addEventListener('submit', createPostHandler);



