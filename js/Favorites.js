import { GithubUser } from "./GithubUser.js";

export class Favorites {
   constructor(root) {
      this.root = document.querySelector(root)

       this.load();
   }

   save() {
      localStorage.setItem("@github-fav:", JSON.stringify(this.entries))
   }

   async add(username) {
      try {
         const userExist = this.entries.find(entry => entry.login === username);

         if(userExist) {
            throw new Error("Usuario já cadastrado")
         }

         const user = await GithubUser.search(username)
         if(user.login === undefined) {
            throw new Error("Usuario não encontrado")
         }
         
         this.entries = [user, ...this.entries]
         this.uptade();
         this.save();

      } catch (error) {
         alert(error.message)
      }
   }

   load() {
      this.entries = JSON.parse(localStorage.getItem('@github-fav:')) || [];
   }

   delete(user) {
      const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

      this.entries = filteredEntries;
      this.uptade();
      this.save();
   }
}

export class FavoritesView extends Favorites {
   constructor(root) {
      super(root)

      this.tbody = this.root.querySelector("table tbody")

      this.uptade();
      this.onadd();
   }

   onadd() {
      const addButton = this.root.querySelector(".search button");
      addButton.onclick = () => {
         const { value } = this.root.querySelector(".search input")
         this.add(value)
      }
   }

   uptade() {
      this.removeAllTr();

      this.entries.forEach( user => {
         const row = this.createRow();

         row.querySelector('.user img').src = `https://github.com/${user.login}.png`
         row.querySelector('.user img').alt = `Imagem de ${user.name}`
         row.querySelector('.user p').textContent = user.name
         row.querySelector('.user A').href = `https://github.com/${user.login}`
         row.querySelector('.user span').textContent = user.login
         row.querySelector('.repositories').textContent = user.public_repos
         row.querySelector('.followers').textContent = user.followers

         row.querySelector('.remove').onclick = () => {
            const isOk = confirm("Realmente desejar remover esse usúario?")

            if(isOk) {
               try {
                  this.delete(user);
               } catch (error){
                  console.error('Erro ao remover usúario:", error');
               }
            }
         }
         this.tbody.append(row)
      })
   }

   createRow() {
      const tr = document.createElement("tr");

      tr.innerHTML = `
            <td class="user">
            <img src="https://github.com/gusfngg.png">
            <a href="https://github.com/gusfngg" target="_blank">
               <p>Gustavo Campos</p>
               <span>gusfngg</span>
            </a>
         </td>
         <td class="repositories">88</td>
         <td class="followers">188</td>
         <td>
            <button class="remove">Remover</button>
         </td>
      `  

      return tr
   }

   removeAllTr() {
      this.tbody.querySelectorAll("tr")
      .forEach(tr => tr.remove())
   }
}