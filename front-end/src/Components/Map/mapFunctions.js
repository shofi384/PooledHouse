const EMERALD_GREEN = "#1a9850";        // lvl (6/6)
const PARAKEET_GREEN = "#91cf60";       // lvl (5/6)
const LIME_GREEN = "#d9ef8b";           // lvl (4/6)
const CRIMSON_RED = "#d73027";          // lvl (3/6)
const ORANGE = "#fc8d59";               // lvl (2/6)
const NAVAJO_WHITE = "#fee08b";         // lvl (1/6)


const AVERAGE_ALL = 110;    // FIXME: fetch this data from database
const HIGHEST = 200;        // FIXME: fetch this data from database

// pre: a number as a param
// post: return color code
/*
const getColor = (amount, max) =>{
    const level = getLevel(amount, max);
    switch(level){
        case 7:
            return EMERALD_GREEN;
        case 6:
            return PARAKEET_GREEN;
        case 5:
            return LIME_GREEN;
        case 4:
            return CRIMSON_RED;
        case 3:
            return ORANGE; 
        default:
            return NAVAJO_WHITE;
    }
}
*/

const getColor = (amount) => {
    if (amount < 100) return ORANGE;
    if (amount < 200) return CRIMSON_RED;
    if (amount < 300) return LIME_GREEN;
    if (amount < 400) return PARAKEET_GREEN;
    return EMERALD_GREEN;
}

// pre: a number as a param
// post: return an integer between [1,6]
const getLevel = (amount, max) =>{
    return Math.floor((amount*7)/max);
}

//this function takes db tipentry list and returns an object containing neighborhood name, avg tips/hour, total hours
//deprecated
const averageTipsByNeighborhood = (tip_info) => {
//    console.log(tip_info);
    const neighborhoods = new Object();
    tip_info.forEach(entry => {
        let hoodName = entry.neighborhood;
        if (! neighborhoods.hasOwnProperty(hoodName)) {
            neighborhoods[hoodName] = {neighborhood: hoodName,
                                    tipsPerHour: (entry.takehome / entry.shift_length),
                                    totalHour: entry.shift_length};
        }
        else {
            let hours = (neighborhoods[hoodName].totalHour + entry.shift_length);
            neighborhoods[hoodName].tipsPerHour = neighborhoods[hoodName].tipsPerHour * neighborhoods[hoodName].totalHour / hours + entry.takehome / hours;
            neighborhoods[hoodName].totalHour = hours;
        }
    });
    return neighborhoods;
}

//this function works just like averageTipsByNeighborhood, but filters by day of week.
//deprecated
const aTBNDayParse = (tip_info, day) => {
//    console.log(tip_info);
    const neighborhoods = new Object();
    tip_info.forEach(entry => {
        let e_day = new Date(entry.shift_date).getDay();
        e_day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][e_day];
        if (e_day == day) {
            let hoodName = entry.neighborhood;
            if (! neighborhoods.hasOwnProperty(hoodName)) {
                neighborhoods[hoodName] = {neighborhood: hoodName,
                                        tipsPerHour: (entry.takehome / entry.shift_length),
                                        totalHour: entry.shift_length};
            }
            else {
                let hours = (neighborhoods[hoodName].totalHour + entry.shift_length);
                neighborhoods[hoodName].tipsPerHour = neighborhoods[hoodName].tipsPerHour * neighborhoods[hoodName].totalHour / hours + entry.takehome / hours;
                neighborhoods[hoodName].totalHour = hours;
            }
        }
    });
    return neighborhoods;
}

//this works like the original averageTipByNeighborhood, but filters by day, shift, and position.
exports.aTBNMasterParse = (tip_info, day, shift, position) => {
//    console.log(tip_info);
    const neighborhoods = new Object();
    tip_info.forEach(entry => {
        let e_day = new Date(entry.shift_date).getDay();
        e_day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][e_day];
        if ((day == 'All' || e_day == day) && 
            (shift == 'All' ||  entry.shift_time == shift) && 
            (position == 'All' || entry.shift_position == position)) {

                let hoodName = entry.neighborhood;
                if (! neighborhoods.hasOwnProperty(hoodName)) {
                    neighborhoods[hoodName] = {neighborhood: hoodName,
                                            tipsPerHour: (entry.takehome / entry.shift_length),
                                            totalHour: entry.shift_length};
                }
                else {
                    let hours = (neighborhoods[hoodName].totalHour + entry.shift_length);
                    neighborhoods[hoodName].tipsPerHour = neighborhoods[hoodName].tipsPerHour * neighborhoods[hoodName].totalHour / hours + entry.takehome / hours;
                    neighborhoods[hoodName].totalHour = hours;
                }
        }
    });
    return neighborhoods;
}


//takes the neighborhoods object returns by averageTipsByNeighborhood and returns an object for use by reactnyc component
exports.averageTipsClean = (average_tips) => {
    let data = [];
    let element = {};
    for (var entry in average_tips) {
      element = {};
      element.name = average_tips[entry].neighborhood;
      element.values = [];
      element.values.push({label: "Avg Hourly $", val: Math.floor(average_tips[entry].tipsPerHour)});
//      console.log(element.values[0].val);
      element.color = getColor(element.values[0].val);
      data.push(element);
    }
    return data;
}

//export { getColor, averageTipsClean, aTBNMasterParse };