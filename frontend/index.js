 const API = "http://localhost:5000/api/user";
      
      const DEFAULT_PIC = "./image/Profile Icon.webp"; 

      const userForm = document.getElementById("userForm");
      const myForm = document.getElementById("myForm");
      const dataBody = document.getElementById("data");
      const newUserBtn = document.getElementById("newUser");
      const previewImg = document.getElementById("previewImg");
      const imgInput = document.getElementById("imgInput");
      const passwordInput = document.getElementById("password");
      
      let editEmail = null;
      let usersData = []; 
      
      
      newUserBtn.onclick = () => {
        editEmail = null;
        document.getElementById("formTitle").innerText = "Add New User";
        myForm.reset();
        previewImg.src = DEFAULT_PIC;
        document.getElementById("email").readOnly = false; 
        passwordInput.style.display = 'block'; 
        passwordInput.required = true; 
        userForm.classList.remove("hidden");
      };

      
      function closeForm() {
        userForm.classList.add("hidden");
      }

     
      imgInput.addEventListener("change", () => {
        const file = imgInput.files[0];
        if (file) previewImg.src = URL.createObjectURL(file);
      });

      
      async function fetchUsers() {
        try {
            const res = await fetch(`${API}/getall`);
            if (!res.ok) throw new Error('Failed to fetch users');
            usersData = await res.json(); 

            dataBody.innerHTML = "";
            let count = 1;

            usersData.forEach((u) => {
            
                const imageSrc = u.profile_pic || DEFAULT_PIC; 

                dataBody.innerHTML += `
                    <tr>
                      <td class="border py-2">${count++}</td>
                      <td class="border py-2">
                        <img class="w-12 h-12 rounded-full mx-auto" 
                            src="${imageSrc}" 
                            onerror="this.onerror=null; this.src='${DEFAULT_PIC}';" />
                      </td>
                      <td class="border py-2">${u.name || "-"}</td>
                      <td class="border py-2">${u.email}</td>

                      <td class="border py-2 flex justify-center gap-2">
                        <button onclick="editUser('${u.email}')" class="bg-yellow-500 text-white px-2 rounded">Edit</button>
                        <button onclick="deleteUser('${u.email}')" class="bg-red-500 text-white px-2 rounded">Delete</button>
                      </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Failed to load users: " + error.message);
        }
      }

      fetchUsers();

     
      myForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        let url = "";
        let method = "";
        let res;

        if (editEmail) {
           
            url = `${API}/${editEmail}`;
            method = "PUT";
            
            const updateData = {};
            
            const nameValue = document.getElementById("name").value;
            if(nameValue) updateData.name = nameValue;
            
           
            const newPassword = document.getElementById("password").value;
            if(newPassword) updateData.password = newPassword;

            res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

        } else {
            
            url = `${API}/create`;
            method = "POST";
            
            const formData = new FormData();
            
            ["name", "email"].forEach((id) =>
                formData.append(id, document.getElementById(id).value)
            );
            
            
            formData.append("password", document.getElementById("password").value);
          
            if (imgInput.files[0]) formData.append("pic", imgInput.files[0]); 
            
            res = await fetch(url, { method, body: formData });
        }

       
        if (!res.ok) {
            const errorData = await res.json();
            const action = editEmail ? "Update" : "Creation";
            alert(`${action} failed: ` + (errorData.error || res.statusText));
        }
        
        fetchUsers();
        closeForm();
      });

      //  Delete User
      async function deleteUser(email) {
        if (!confirm("Are you sure?")) return;
        
        try {
            const res = await fetch(`${API}/${email}`, { method: "DELETE" });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Delete failed'); 
            }
            
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user: " + error.message); 
        }
      }

      // Edit User 
      async function editUser(email) {
        editEmail = email;

        const u = usersData.find(user => user.email === email); 
        
        if (!u) {
            alert("User data not found for edit.");
            return;
        }

        document.getElementById("formTitle").innerText = "Update User";
        document.getElementById("email").value = u.email || "";
        document.getElementById("email").readOnly = true; 
        passwordInput.style.display = 'block'; 
        passwordInput.required = false;
        passwordInput.value = ""; 

        document.getElementById("name").value = u.name || "";
        
      
        previewImg.src = u.profile_pic || DEFAULT_PIC; 

        userForm.classList.remove("hidden");
      }