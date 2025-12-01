async function fetchContacts() {
  const res = await fetch('/api/contacts');
  const data = await res.json();
  const ul = document.getElementById('contacts-list');
  ul.innerHTML = '';
  data.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.name} — ${c.email}`;
    ul.appendChild(li);
  });
}

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name || !email) return;
  await fetch('/api/contacts', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, email})
  });
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  fetchContacts();
});

fetchContacts();
