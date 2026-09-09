let jobs = [];


// ==========================================
// LOAD JOBS
// ==========================================

fetch("data/jobs.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("Could not load jobs.json");
        }

        return response.json();
    })

    .then(data => {

        jobs = data;

        renderFeatured(jobs.slice(0, 3));

        renderJobsPage();

        renderSavedJobs();

        renderDashboard();

        renderJobDetail();

    })

    .catch(error => {

        console.error("Error loading jobs:", error);

    });



// ==========================================
// CREATE JOB CARD
// ==========================================

function createJobCard(job) {

    return `
        <div class="jobs-card">

            <div class="company">
                ${job.company}
            </div>

            <h3>
                ${job.title}
            </h3>

            <p class="job-location">
                📍 ${job.location}
            </p>

            <p class="salary">
                💰 ${job.salary}
            </p>

            <div class="meta">

                ${job.skills.map(skill => `
                    <span class="tag">
                        ${skill}
                    </span>
                `).join("")}

            </div>


            <div class="actions">

                <a
                    href="job-detail.html?id=${job.id}"
                    class="btn"
                >
                    View Detail
                </a>


                <button
                    class="btn secondary"
                    onclick="saveJob(${job.id})"
                >
                    Save
                </button>
                

            </div>

        </div>
    `;
}



// ==========================================
// FEATURED JOBS
// ==========================================

function renderFeatured(jobList) {

    const featuredJobs =
        document.getElementById("featuredjobs");

    if (!featuredJobs) {
        return;
    }

    featuredJobs.innerHTML =
        jobList.map(createJobCard).join("");
}



// ==========================================
// JOBS PAGE
// ==========================================

function renderJobsPage() {

    const jobList =
        document.getElementById("joblist");

    if (!jobList) {
        return;
    }

    const searchInput =
        document.getElementById("searchinput");

    const locationInput =
        document.getElementById("locationinput");

    const typeFilter =
        document.getElementById("typefilter");

    const categoryFilter =
        document.getElementById("categoryfilter");



    function filterJobs() {

        const keyword =
            searchInput.value.toLowerCase().trim();

        const location =
            locationInput.value.toLowerCase().trim();

        const type =
            typeFilter.value.toLowerCase();

        const category =
            categoryFilter.value.toLowerCase();


        const filteredJobs = jobs.filter(job => {

            const searchText = `
                ${job.title}
                ${job.company}
                ${job.skills.join(" ")}
            `.toLowerCase();


            const matchesKeyword =
                searchText.includes(keyword);


            const matchesLocation =
                job.location
                    .toLowerCase()
                    .includes(location);


            const matchesType =
                type === "all" ||
                job.type.toLowerCase() === type;


            const matchesCategory =
                category === "all" ||
                job.category.toLowerCase() === category;


            return (
                matchesKeyword &&
                matchesLocation &&
                matchesType &&
                matchesCategory
            );

        });


        jobList.innerHTML =
            filteredJobs.map(createJobCard).join("");


        const resultCount =
            document.getElementById("resultcount");

        if (resultCount) {

            resultCount.textContent =
                `${filteredJobs.length} jobs`;

        }

    }


    searchInput.addEventListener(
        "input",
        filterJobs
    );

    locationInput.addEventListener(
        "input",
        filterJobs
    );

    typeFilter.addEventListener(
        "change",
        filterJobs
    );

    categoryFilter.addEventListener(
        "change",
        filterJobs
    );


    // Get search from home page

    const savedKeyword =
        localStorage.getItem("jobkeyword") || "";

    const savedLocation =
        localStorage.getItem("joblocation") || "";


    searchInput.value = savedKeyword;
    locationInput.value = savedLocation;


    filterJobs();

}



// ==========================================
// SAVE JOB
// ==========================================

function saveJob(id) {

    let savedJobs =
        JSON.parse(
            localStorage.getItem("savedjobs")
        ) || [];


    id = Number(id);


    if (!savedJobs.includes(id)) {

        savedJobs.push(id);

        localStorage.setItem(
            "savedjobs",
            JSON.stringify(savedJobs)
        );

        alert("Job saved successfully!");

        renderSavedJobs();
        renderDashboard();

    }

    else {

        alert("Job already saved!");

    }

}



// ==========================================
// SAVED JOBS PAGE
// ==========================================

function renderSavedJobs() {

    const savedContainer =
        document.getElementById("saved-jobs");

    if (!savedContainer) {
        return;
    }


    const savedIds =
        JSON.parse(
            localStorage.getItem("savedjobs")
        ) || [];


    const savedJobs =
        jobs.filter(job =>
            savedIds.includes(Number(job.id))
        );


    if (savedJobs.length === 0) {

        savedContainer.innerHTML = `
            <div class="empty">
                <h3>No saved jobs</h3>
                <p>You have not saved any jobs yet.</p>

                <a href="jobs.html" class="btn">
                    Find Jobs
                </a>
            </div>
        `;

        return;

    }


    savedContainer.innerHTML =
        savedJobs.map(createJobCard).join("");

}



// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {

    const savedCount =
        document.getElementById("savedcount");

    const totalJobs =
        document.getElementById("totaljobs");

    const internshipCount =
        document.getElementById("internshipcount");


    if (!savedCount &&
        !totalJobs &&
        !internshipCount) {

        return;
    }


    const savedIds =
        JSON.parse(
            localStorage.getItem("savedjobs")
        ) || [];


    if (savedCount) {

        savedCount.textContent =
            savedIds.length;

    }


    if (totalJobs) {

        totalJobs.textContent =
            jobs.length;

    }


    if (internshipCount) {

        const internships =
            jobs.filter(
                job =>
                    job.type.toLowerCase() ===
                    "internship"
            ).length;

        internshipCount.textContent =
            internships;

    }

}



// ==========================================
// JOB DETAIL
// ==========================================

function renderJobDetail() {

    const detail =
        document.getElementById("jobsdetail");

    if (!detail) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(params.get("id"));


    const job =
        jobs.find(
            job => Number(job.id) === id
        );


    if (!job) {

        detail.innerHTML = `
            <h2>Job not found</h2>
            <a href="jobs.html" class="btn">
                Back to Jobs
            </a>
        `;

        return;

    }


    detail.innerHTML = `

        <p class="eyebrow">
            ${job.category}
        </p>

        <h1>
            ${job.title}
        </h1>

        <h3>
            ${job.company}
        </h3>

        <p>
            📍 ${job.location}
        </p>

        <p>
            💰 ${job.salary}
        </p>

        <p>
            💼 ${job.type}
        </p>


        <hr>


        <h2>Description</h2>

        <p>
            ${job.description}
        </p>


        <h2>Skills</h2>

        <div class="meta">

            ${job.skills.map(skill => `
                <span class="tag">
                    ${skill}
                </span>
            `).join("")}

        </div>


        <h2>Requirements</h2>

        <ul>

            ${job.requirements.map(req => `
                <li>${req}</li>
            `).join("")}

        </ul>


        <div class="actions">

            <button
                class="btn"
                onclick="saveJob(${job.id})"
            >
                Save Job
            </button>

            <a
                href="jobs.html"
                class="btn secondary"
            >
                Back to Jobs
            </a>

        </div>

    `;

}



// ==========================================
// HOME SEARCH FORM
// ==========================================

const searchForm =
    document.getElementById("searchForm");


if (searchForm) {

    searchForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const keyword =
                document.getElementById("keyword")
                    .value.trim();


            const location =
                document.getElementById("location")
                    .value.trim();


            localStorage.setItem(
                "jobkeyword",
                keyword
            );


            localStorage.setItem(
                "joblocation",
                location
            );


            window.location.href =
                "jobs.html";

        }
    );

}