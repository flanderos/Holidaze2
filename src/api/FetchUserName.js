export const getUserNameFromLocalStorage = () => {
  const userDataString = localStorage.getItem("userData");
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    return userData.name;
  }
  return "No user found";
};
