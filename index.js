/**
 * Index file.
 */
"use strict";

/**
 * @param  {String}     url         [Url to request]
 * @param  {[type]}     method      [Type of Ajax request]
 * @param  {Function}   callback    [Callback function to call]
 */
const asyncAjax = url => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
};

/**
 * Show Progress
 */
const showProgress = () => {
    document.getElementById("progress").style.display = "block";
};

/**
 * Hide Progress
 */
const hideProgress = () => {
    document.getElementById("progress").style.display = "none";
};

const updateDate = date => {
    let updatedDate = new Date(date);
    document.getElementById("last_updated").innerHTML = updatedDate;
};

const updateRRTotal = (rr, total) => {
    let value = `(${rr}/${total})`;
    document.getElementById("RRTotal").innerHTML = value;
};

const updateCount = data => {
    let studentsCount = data.reduce((a, b) => a + b.studentsCount, 0);
    let staffsCount = data.reduce((a, b) => a + b.staffCount, 0);

    let avgStudCountPerStaff = Math.ceil(studentsCount / staffsCount);

    document.getElementById("StudCount").innerHTML = studentsCount;
    document.getElementById("StaffCount").innerHTML = staffsCount;
    document.getElementById("AvgStaffCount").innerHTML = avgStudCountPerStaff;
};

let dataSource,
    sourceChart = null;

/**
 * Initialization.
 * Fetches data and renders chart.
 */
async function init() {
    showProgress();
    const res = await fetch(
        "https://gist.githubusercontent.com/balasubramanim/fc66826974e13e134e33512f9f634d4b/raw"
    );
    const json = await res.json();
    dataSource = json.data;

    dataSource = dataSource.map(val => {
        return {
            studentsCount: Number(val.number_of_students),
            school_name: val.school_name,
            district: val.district,
            category: val.category_of_school,
            establishment:
                val.yearof_establishment === "NULL"
                    ? "-"
                    : val.yearof_establishment,
            medium: val.school_medium,
            subjects_offered:
                val.subject_offered === "NULL" ? "-" : val.subject_offered,
            pincode: val.pincode,
            differently_abled: val.number_of_differently_abled_student,
            staffCount: Number(val.number_of_staff),
            number_of_classrooms: val.number_of_classrooms,
            availabilty_of_playground:
                val.availabilty_of_playground === "NULL"
                    ? "-"
                    : val.availabilty_of_playground,
            availabilty_of_eateries: val.availabilty_of_eateries,
            availabilty_of_hospital: val.availabilty_of_hospital,
            number_of_restrooms: Number(val.number_of_restrooms)
        };
    });

    onSelect(1);
    updateDate(json.updatedAt);
}

const getChart = value => {};

/**
 * Chart Initialization.
 * @param  {Array} data [Array of data of Physical infrastructure facilities in Municipality and Corporation schools in Tamil Nadu]
 */
const initChart = () => {
    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "scatterplot",
                x: "district",
                y: "studentsCount",
                color: "district",
                data: dataSource,
                size: "studentsCount",
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")({
                        formatters: {
                            studentsCount: {
                                label: "Number of Students"
                            },
                            district: {
                                label: "District"
                            },
                            category: {
                                label: "Category of School"
                            },
                            establishment: {
                                label: "Year of Establishment"
                            },
                            subjects_offered: {
                                label: "Subjects Offered"
                            },
                            medium: {
                                label: "School Medium"
                            },
                            school_name: {
                                label: "School Name"
                            },
                            pincode: {
                                label: "Pincode"
                            },
                            differently_abled: {
                                label: "Number of Differently Abled Students"
                            },
                            staffCount: {
                                label: "Number of Staffs"
                            },
                            number_of_classrooms: {
                                label: "Number of Classrooms"
                            },
                            availabilty_of_playground: {
                                label: "Availability of Playground"
                            },
                            availabilty_of_eateries: {
                                label: "Availability of Eateries"
                            },
                            availabilty_of_hospital: {
                                label: "Availability of Hospital"
                            },
                            number_of_restrooms: {
                                label: "Number of Restrooms"
                            }
                        }
                    }),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch {
            reject("Failed to initialize Chart!");
        }
    });

    // document.getElementById("PrimaryBar").innerHTML = "";
    // chart.renderTo("#PrimaryBar");
    // hideProgress();

    // chart.renderTo("#PrimaryBar");

    // initCategoryChart(mapData);
    // initRRChart(mapData);
    // initMediumChart(mapData);
    // initPgChart(mapData);
    // updateCount(mapData);
    // hideProgress();
};

const groupBy = (objectArray, property) => {
    return objectArray.reduce(function(acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
};

const initRRChart = () => {
    let total = dataSource.length;
    let mapData = dataSource
        .filter(val => val.number_of_restrooms === 0)
        .map(val => {
            return {
                school_name: val.school_name,
                district: val.district,
                staffCount: val.staffCount,
                studentsCount: val.studentsCount,
                differently_abled: val.differently_abled
            };
        });

    let rr = mapData.length;
    // updateRRTotal(rr, total);

    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "scatterplot",
                x: "district",
                y: "studentsCount",
                color: "district",
                data: mapData,
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")({
                        formatters: {
                            school_name: {
                                label: "School Name"
                            },
                            district: {
                                label: "District"
                            },
                            staffCount: {
                                label: "Number of Staffs"
                            },
                            studentsCount: {
                                label: "Number of Students"
                            },
                            differently_abled: {
                                label: "Number of Differently Abled Students"
                            }
                        }
                    }),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch {
            reject("Failed to initialize Chart!");
        }
    });
};

const initCategoryChart = () => {
    let mapObj = groupBy(dataSource, "category");

    let mapData = [];

    for (let key in mapObj) {
        let obj = {
            category: key,
            schoolCount: mapObj[key].length,
            studentsCount: mapObj[key].reduce((a, b) => a + b.studentsCount, 0),
            staffCount: mapObj[key].reduce((a, b) => a + b.staffCount, 0)
        };
        mapData.push(obj);
    }
    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "bar",
                x: "category",
                y: "schoolCount",
                color: "category",
                data: mapData,
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")({
                        formatters: {
                            schoolCount: {
                                label: "Schools"
                            },
                            studentsCount: {
                                label: "Students"
                            },
                            staffCount: {
                                label: "Staffs"
                            },
                            category: {
                                label: "Category"
                            }
                        }
                    }),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch {
            reject("Failed to initialize Chart!");
        }
    });

    // document.getElementById("PrimaryBar").innerHTML = "";
    // chart.renderTo("#CategoryBar");
    // hideProgress();
};

const initMediumChart = () => {
    let mapObj = groupBy(dataSource, "medium");

    let mapData = [];

    for (let key in mapObj) {
        let obj = {
            medium: key,
            schoolCount: mapObj[key].length,
            studentsCount: mapObj[key].reduce((a, b) => a + b.studentsCount, 0)
        };
        mapData.push(obj);
    }

    return new Promise((resolve, reject) => {
        try {
            let chart = new Taucharts.Chart({
                type: "bar",
                x: "medium",
                y: "schoolCount",
                color: "medium",
                data: mapData,
                settings: {
                    renderingTimeout: 1000
                },
                plugins: [
                    Taucharts.api.plugins.get("tooltip")({
                        formatters: {
                            schoolCount: {
                                label: "Schools"
                            },
                            studentsCount: {
                                label: "Students"
                            },
                            medium: {
                                label: "Medium"
                            }
                        }
                    }),
                    Taucharts.api.plugins.get("legend")()
                ]
            });
            resolve(chart);
        } catch {
            reject("Failed to initialize Chart!");
        }
    });
};

const onSelect = value => {
    showProgress();

    if (sourceChart !== null) {
        sourceChart.destroy();
    }

    let selectedVal = Number(value);
    let chartObj;

    switch (selectedVal) {
        case 1:
            chartObj = initChart();
            break;
        case 2:
            chartObj = initCategoryChart();
            break;
        case 3:
            chartObj = initRRChart();
            break;
        case 4:
            chartObj = initMediumChart();
            break;
        default:
            chartObj = initChart();
    }

    chartObj
        .then(chart => {
            document.getElementById("PrimaryBar").innerHTML = "";
            chart.renderTo("#PrimaryBar");
            sourceChart = chart;
            hideProgress();
        })
        .catch(err => console.error(err));
};
const initPgChart = data => {
    let mapData = data.map(val => {
        return {
            school_name: val.school_name,
            district: val.district,
            studentsCount: val.studentsCount,
            differently_abled: val.differently_abled,
            playground: val.availabilty_of_playground,
            canteen: val.availabilty_of_eateries,
            hospital: val.availabilty_of_hospital
        };
    });

    // Chart init.
    let chart = new Taucharts.Chart({
        type: "line",
        x: "studentsCount",
        y: "district",
        color: "canteen",
        data: mapData,
        settings: {
            renderingTimeout: 1000
        },
        plugins: [
            Taucharts.api.plugins.get("tooltip")({
                formatters: {
                    school_name: {
                        label: "School Name"
                    },
                    district: {
                        label: "District"
                    },
                    studentsCount: {
                        label: "Number of Students"
                    },
                    differently_abled: {
                        label: "Number of Differently Abled Students"
                    },
                    playground: {
                        label: "Playground"
                    },
                    canteen: {
                        label: "Canteen"
                    },
                    hospital: {
                        label: "Hospital"
                    }
                }
            }),
            Taucharts.api.plugins.get("legend")()
        ]
    });

    chart.renderTo("#PGBar");
};

/**
 * Service Worker Init.
 */
window.addEventListener("load", async e => {
    await init();

    if ("serviceWorker" in navigator) {
        try {
            navigator.serviceWorker.register("sw.js");
        } catch (err) {
            console.log(err);
        }
    }
});
