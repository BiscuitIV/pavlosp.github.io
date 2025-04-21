document.addEventListener("DOMContentLoaded", function () {
    const projectLinks = document.querySelectorAll(".headline-date");
    const featuredVideo = document.getElementById("featured-video");

    projectLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            const videoSource = link.getAttribute("data-video");
            if (videoSource) {
                featuredVideo.classList.remove("visible");

                setTimeout(() => {
                    featuredVideo.src = videoSource;
                    featuredVideo.play()
                        .then(() => {
                            featuredVideo.classList.add("visible");
                        })
                        .catch((error) => {
                            console.error("Video playback failed:", error);
                        });
                }, 300); 
            }
        });

        link.addEventListener("mouseleave", () => {

            featuredVideo.classList.remove("visible");

            setTimeout(() => {
                featuredVideo.pause();
                featuredVideo.src = "";
            }, 300); 
        });
    });
});