document.addEventListener("DOMContentLoaded",()=>{
    const logoutText = document.getElementById("logoutText")
    logoutText.addEventListener("click", async()=>{
      try {
            const response = await fetch("/logout", { method: "POST" });
            const message = await response.text();
            alert(message); 
            window.location.href = "/signup"; 
        } catch (err) {
            console.error("Erreur lors de la déconnexion :", err);
        }
          
    })
    
})