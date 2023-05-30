const delButtonHandler = async (event) => {
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/projects/${post_id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert('Failed to delete project');
    }
};


document
    .querySelector('.delete-post-btn')
    .addEventListener('click', delButtonHandler);
