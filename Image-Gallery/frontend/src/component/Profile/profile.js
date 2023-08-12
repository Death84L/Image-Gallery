import React, { useEffect, useState } from "react";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    username: "",
    profession: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [editProfileData, setEditProfileData] = useState({
    name: "",
    email: "",
    profession: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      window.location.replace("/login");
    } else {
      fetchProfileData(username, token);
    }
  }, []);

  const fetchProfileData = (username, token) => {
    fetch(`http://localhost:5000/api/profile/${username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data);
        setEditProfileData(data); // Pre-fill the edit form with user profile data
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditProfileData({
      ...editProfileData,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    fetch(`http://localhost:5000/api/profile/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editProfileData),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data); // Update the user profile with the updated data
        setIsEditing(false); // Close the edit modal
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div>
      <h2>Profile Page</h2>
      <form>
        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editProfileData.name}
            onChange={handleInputChange}
          />
        ) : (
          <input type="text" value={userProfile.name} readOnly />
        )}

        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={editProfileData.email}
            onChange={handleInputChange}
          />
        ) : (
          <input type="email" value={userProfile.email} readOnly />
        )}

        <label>Username:</label>
        <input type="text" value={userProfile.username} readOnly />

        <label>Profession:</label>
        {isEditing ? (
          <input
            type="text"
            name="profession"
            value={editProfileData.profession}
            onChange={handleInputChange}
          />
        ) : (
          <input type="text" value={userProfile.profession} readOnly />
        )}

        {isEditing ? (
          <div>
            <button type="button" onClick={handleSaveProfile}>
              Save Profile
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={handleEditProfile}>
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
