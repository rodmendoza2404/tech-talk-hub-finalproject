export function getUserId() {
    let userId = localStorage.getItem("userId");
    
    if (!userId) {
      // Create a random user id
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }
  
    return userId;
  }
  