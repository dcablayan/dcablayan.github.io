document.addEventListener('DOMContentLoaded', function() {
  const collapsibleContainers = document.querySelectorAll('.collapse-container');

  collapsibleContainers.forEach(container => {
    container.addEventListener('click', function() {
      const target = document.querySelector(this.getAttribute('data-target'));
      target.classList.toggle('show');
    });
  });
});
