document.addEventListener("DOMContentLoaded", function () {
  // Get the team members
  const teamMembers = document.querySelectorAll(".team-member");

  // Add animation delay to team members for staggered appearance
  teamMembers.forEach((member, index) => {
    member.style.animationDelay = `${index * 0.2}s`;
  });

  // Add descriptions for team members
  updateTeamMemberDescriptions();
});

// Function to update team member descriptions
function updateTeamMemberDescriptions() {
  const descriptions = {
    CEO: "strategic vision and overall direction of our travel services, ensuring we deliver exceptional experiences to our customers.",
    "Team Lead":
      "coordinating our talented team of travel experts and developing innovative travel packages that exceed customer expectations.",
    "Delivery Head":
      "ensuring smooth operations and timely delivery of all travel services, maintaining our high standards of quality and customer satisfaction.",
  };

  // Get all team members
  const teamMembers = document.querySelectorAll(".team-member");

  // Update descriptions based on role
  teamMembers.forEach((member) => {
    const role = member.querySelector(".role-badge").textContent;
    const descriptionElement = member.querySelector("p");

    if (descriptions[role]) {
      const name = member.querySelector("h3").textContent;
      descriptionElement.textContent = `${name} is responsible for ${descriptions[role]}`;
    }
  });
}
