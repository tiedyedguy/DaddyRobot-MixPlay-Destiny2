var data = {};
var shownyet = false;
var itopen = false;

window.addEventListener("load", function initMixer() {
  mixer.socket.on("event", handleEvents);
  console.log("Loading Mixer");
  mixer.isLoaded();
});

function showEquip(which) {
  console.log("Running showEquip");
  $(".popups").hide();
  $("#" + which + "-popup").fadeIn();
}
window.showEquip = showEquip;

function handleEvents(event) {
  switch (event.type) {
    case "updatedata":
      console.log("Updating Data Event");

      if (!shownyet) {
        data = event.data;
        shownyet = true;
        $("#d2pullout").addClass("tada");
        $("#d2pullout").addClass("delay-1s");
        $("#d2pullout").addClass("animated");
        buildChars();
        buildBox();
      } else {
        if (JSON.stringify(data) != JSON.stringify(event.data)) {
          console.log("New data! Time to update!");
          data = event.data;
          buildBox();
        } else {
          console.log("Same data! No Update");
        }
      }
  }
}

$("#d2pullout").click(() => {
  if (shownyet) {
    if (!itopen) {
      $("#d2pullout").hide("slide", { direction: "right" }, 500);
      setTimeout(() => {
        $("#mixplay").show("slide", { direction: "right" }, 500);
      }, 550);
      itopen = true;
    }
  } else {
    let oldhtml =
      '<div class="d2pulloutimage"></div><div class="d2pullouttext">MixPlay</div></div>';
    let newhtml = "Still Loading, hold up.";
    $("#d2pullout").html(newhtml);
    setTimeout(() => {
      $("#d2pullout").html(oldhtml);
    }, 1000);
  }
});

function closeMixPlay() {
  if (itopen) {
    $("#mixplay").hide("slide", { direction: "right" }, 500);
    setTimeout(() => {
      $("#d2pullout").show("slide", { direction: "right" }, 500);
    }, 550);

    itopen = false;
  }
}
window.closeMixPlay = closeMixPlay;

let pickedchar = "";

function pickchar(which, charkey) {
  console.log("Running pickchar");
  pickedchar = charkey;
  $("#character0").removeClass("character_selected");
  $("#character1").removeClass("character_selected");
  $("#character2").removeClass("character_selected");
  $("#character" + which).addClass("character_selected");
  buildBox();
}
window.pickchar = pickchar;
function buildChars() {
  console.log("Running buildChars");
  let count = 0;
  Object.keys(data.characters).forEach((charKey) => {
    let html =
      "<div onclick='pickchar(" +
      count +
      ',"' +
      charKey +
      "\")' id='character" +
      count +
      "' class='character'>" +
      data.characters[charKey].class +
      " " +
      data.characters[charKey].race +
      "</div>";
    $("#charselector").append(html);
    if (count == 0) {
      pickedchar = charKey;
      $("#character0").addClass("character_selected");
    }
    count = count + 1;
  });
  let html = "<div onclick='closeMixPlay()'  class='character'>Close</div>";
  $("#charselector").append(html);
}

function buildBox() {
  console.log("Running BuildBox");
  buildStats();
  buildEquipment();
  doSubClass();
  doEmblem();
}

function doEmblem() {
  console.log("Running doEmblem");
  $(".emblemClass").text(data.characters[pickedchar].class);
  $(".emblemRaceGender").text(
    data.characters[pickedchar].race + " " + data.characters[pickedchar].gender
  );
  $(".emblemLight").text(data.characters[pickedchar].light);
  $(".emblem").css(
    "background-image",
    "url('https://www.bungie.net/" + data.characters[pickedchar].emblem + "')"
  );
}

function doSubClass() {
  console.log("Running doSubClass");
  $(".subclass").css(
    "background-image",
    "url('https://www.bungie.net/" +
      data.characters[pickedchar].subclassEmblem +
      "')"
  );
}

function hideEquip(which) {
  console.log("Running hideEquip");
  $("#" + which + "-popup").fadeOut();
}
window.hideEquip = hideEquip;

function tierTypeToColor(type) {
  switch (type) {
    case 0:
      return "grey";
    case 1:
      return "grey";
    case 2:
      return "grey";
    case 3:
      return "green";
    case 4:
      return "lightblue";
    case 5:
      return "#522f65";
    case 6:
      return "#D8BD48";
    default:
      return "#000000";
  }
}

function makeEquipmentPopUp(which) {
  console.log("Running makeEquipmentPopUp");
  let html = "<div id='" + which + "-popup' class='popups equipmentpopup'>";
  html =
    html +
    "<div class='equipmentpopupclose' onclick='hideEquip(\"" +
    which +
    "\")'>X</div>";
  html =
    html +
    "<div class='equipmentpopupheader' style='background:" +
    tierTypeToColor(data.characters[pickedchar].equipment[which].tierType) +
    "'><span class='equipmentpopupname'>" +
    data.characters[pickedchar].equipment[which].name +
    "</span><br><span class='equipmentpopuptype'>" +
    data.characters[pickedchar].equipment[which].itemTypeAndTierDisplayName +
    "</span></div>";
  html = html + "<div class='equipmentpopupcontent'>";
  html =
    html +
    "<div class='equipmentpopuplight'>" +
    data.characters[pickedchar].equipment[which].light +
    "</div>";
  html = html + "<div class='equipmentpopupstats'>";
  data.characters[pickedchar].equipment[which].stats.forEach((stat) => {
    html =
      html +
      "<div class='equipmentpopupstat'>" +
      stat.name +
      " - " +
      stat.value +
      "</div>";
  });
  html = html + "</div>";
  html = html + "<div class='equipmentpopupperks'>Weapon Perks</div>";
  data.characters[pickedchar].equipment[which].perks.forEach((perk) => {
    html =
      html +
      "<div class='equipmenetpopupperkline'><div class='equipmenetpopupperkicon' style='background-image:url(\"https://www.bungie.net/" +
      perk.icon +
      "\")'></div><div class='equipmentpopupperk'>" +
      perk.name +
      "</div></div>";
  });

  html = html + "</div></div>";
  $("body").append(html);
}

function buildEquipment() {
  console.log("Running buildEquipment");
  $("#Weapon").html("");
  $("#Armor").html("");
  $(".popups").remove();

  Object.keys(data.characters[pickedchar].equipment).forEach((equipKey) => {
    makeEquipmentPopUp(equipKey);
    let html =
      "<div onclick='showEquip(\"" +
      equipKey +
      "\")' id='" +
      equipKey +
      "' class='" +
      data.characters[pickedchar].equipment[equipKey].type +
      "' style='background-size:contain;background-image: url(\"https://www.bungie.net" +
      data.characters[pickedchar].equipment[equipKey].images.icon +
      "\")'><div class='equipmentlight'>" +
      data.characters[pickedchar].equipment[equipKey].light +
      "</div></div>";

    $("#" + data.characters[pickedchar].equipment[equipKey].type).append(html);
  });
}

function buildStats() {
  console.log("running buildStats");
  $("#pvpstatblock").html("");
  $("#pvestatblock").html("");

  let pvpstats = doPvPStats(data.characters[pickedchar].stats.pvp);

  pvpstats.forEach((pvpstat) => {
    let html =
      "<div class='stat'><div class='stattitle'>" +
      pvpstat.name +
      "</div><div class='statvalues'>" +
      pvpstat.value +
      "</div></div>";
    $("#pvpstatblock").append(html);
  });

  let pvestats = doPvEStats(data.characters[pickedchar].stats.pve);

  pvestats.forEach((pvestat) => {
    let html =
      "<div class='stat'><div class='stattitle'>" +
      pvestat.name +
      "</div><div class='statvalues'>" +
      pvestat.value +
      "</div></div>";
    $("#pvestatblock").append(html);
  });
}

function doPvPStats(statsObj) {
  let stats = [];

  Object.keys(statsObj).forEach((stat) => {
    let details = pvpStatLookup(stat);
    if (details.order != -1) {
      if (statsObj[stat].pga !== undefined) {
        stats.push({
          name: details.name + " PGA",
          value: statsObj[stat].pga,
          order: details.order,
        });
      }
      stats.push({
        name: details.name,
        value: statsObj[stat].basic,
        order: details.order,
      });
    }
  });

  stats.sort((a, b) => (a.order > b.order ? 1 : -1));

  return stats;
}

function doPvEStats(statsObj) {
  let stats = [];
  Object.keys(statsObj).forEach((stat) => {
    let details = pveStatLookup(stat);
    if (details.order != -1) {
      if (statsObj[stat].pga !== undefined) {
        stats.push({
          name: details.name + " PGA",
          value: statsObj[stat].pga,
          order: details.order,
        });
      }

      stats.push({
        name: details.name,
        value: statsObj[stat].basic,
        order: details.order,
      });
    }
  });

  stats.sort((a, b) => (a.order > b.order ? 1 : -1));

  return stats;
}

function pvpStatLookup(statName) {
  switch (statName) {
    case "weaponBestType":
      return { name: "Best Weapon", order: 30 };
    case "weaponKillsMelee":
      return { name: "Melee Kills", order: 29 };
    case "weaponKillsSuper":
      return { name: "Super Kills", order: 28 };
    case "weaponKillsGrenadeLauncher":
      return { name: "Grenade Launcher Kills", order: 27 };
    case "weaponKillsGrenade":
      return { name: "Grenade Kills", order: 26 };
    case "weaponKillsAbility":
      return { name: "Ability Kills", order: 25 };
    case "weaponKillsSword":
      return { name: "Sword Kills", order: 24 };
    case "weaponKillsSideArm":
      return { name: "Sidearm Kills", order: 23 };
    case "weaponKillsBeamRifle":
      return { name: "Beam Rifle Kills", order: 22 };
    case "weaponKillsTraceRifle":
      return { name: "Trace Rifle Kills", order: 21 };
    case "weaponKillsBow":
      return { name: "Bow Kills", order: 20 };
    case "weaponKillsFusionRifle":
      return { name: "Fusion Rifle Kills", order: 19 };
    case "weaponKillsPulseRifle":
      return { name: "Pulse Rifle Kills", order: 18 };
    case "weaponKillsRocketLauncher":
      return { name: "Rocket Launcher Kills", order: 17 };
    case "weaponKillsScoutRifle":
      return { name: "Scout Rifle Kills", order: 16 };
    case "weaponKillsShotgun":
      return { name: "Shotgun Kills", order: 15 };
    case "weaponKillsMachineGun":
      return { name: "Machine Gun Kills", order: 14 };
    case "weaponKillsSubmachinegun":
      return { name: "Submachine Gun Kills", order: 13 };
    case "weaponKillsSniper":
      return { name: "Sniper Kills", order: 12 };
    case "weaponKillsAutoRifle":
      return { name: "Auto Rifle Kills", order: 11 };
    case "weaponKillsHandCannon":
      return { name: "Hand Cannon Kills", order: 10 };
    case "activitiesWon":
      return { name: "Total Wins", order: 9 };
    case "suicides":
      return { name: "Suicides", order: 8 };
    case "deaths":
      return { name: "Deaths", order: 7 };
    case "assists":
      return { name: "Assists", order: 6 };
    case "winLossRatio":
      return { name: "W/L Ratio", order: 5 };
    case "killsDeathsAssists":
      return { name: "KDA", order: 4 };
    case "killsDeathsRatio":
      return { name: "KD", order: 3 };
    case "opponentsDefeated":
      return { name: "Opponents Defeated", order: 2 };
    case "kills":
      return { name: "Kills", order: 1 };
    default:
      return { name: statName, order: -1 };
  }
}

function pveStatLookup(statName) {
  switch (statName) {
    case "orbsDropped":
      return { name: "Orbs Dropped", order: 14 };
    case "longestSingleLife":
      return { name: "Longest Time Alive", order: 13 };
    case "adventuresCompleted":
      return { name: "Adventures", order: 12 };
    case "heroicPublicEventsCompleted":
      return { name: "Heroic Public Events", order: 11 };
    case "averageLifespan":
      return { name: "Avg. Lifespan", order: 10 };
    case "efficiency":
      return { name: "Efficiency", order: 9 };
    case "killsDeathsAssists":
      return { name: "KDA", order: 8 };
    case "killsDeathsRatio":
      return { name: "KD", order: 7 };
    case "activitiesCleared":
      return { name: "Activities Cleared", order: 6 };
    case "suicides":
      return { name: "Suicides", order: 5 };
    case "deaths":
      return { name: "Deaths", order: 4 };
    case "assists":
      return { name: "Assists", order: 3 };
    case "opponentsDefeated":
      return { name: "Opponents Defeated", order: 2 };
    case "kills":
      return { name: "Kills", order: 1 };
    default:
      return { name: statName, order: -1 };
  }
}
