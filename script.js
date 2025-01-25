document.addEventListener("DOMContentLoaded", function () {
    const projectLinks = document.querySelectorAll(".headline-date");
    const featuredVideo = document.getElementById("featured-video");

    projectLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            const videoSource = link.getAttribute("data-video");
            if (videoSource) {
                // Fade out the video first (if it's already playing)
                featuredVideo.classList.remove("visible");

                // Wait for the fade-out transition to complete
                setTimeout(() => {
                    // Set the video source and play it
                    featuredVideo.src = videoSource;
                    featuredVideo.play()
                        .then(() => {
                            // Fade in the new video
                            featuredVideo.classList.add("visible");
                        })
                        .catch((error) => {
                            console.error("Video playback failed:", error);
                        });
                }, 300); // Match this duration with the CSS transition
            }
        });

        link.addEventListener("mouseleave", () => {
            // Fade out the video
            featuredVideo.classList.remove("visible");

            // Wait for the fade-out transition to complete before pausing and clearing the source
            setTimeout(() => {
                featuredVideo.pause();
                featuredVideo.src = "";
            }, 300); // Match this duration with the CSS transition
        });
    });
});