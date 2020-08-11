import moment from "moment";

export default function(obj) {
  const formData = new FormData();
  for (let i in obj) {
    if (i === "avatar") {
      if (!obj[i]) {
        formData.append("removeAvatar", true);
      } else if (obj[i].size) {
        formData.append(i, obj[i]);
      }
    } else if (i === "image" || i === "smallImage") {
      if (!obj[i]) {
        let key = i === "image" ? "removeImage" : "removeSmallImage";
        formData.append(key, true);
      } else if (obj[i].size) {
        formData.append(i, obj[i]);
      }
    } else if (i === "dateTimeStart" || i === "dateTimeEnd") {
      formData.append(i, moment(obj[i]).toISOString());
    } else if (i === "isSpecial" || i === "isStar") {
      formData.append(i, JSON.stringify(obj[i]));
    } else if (i === "isActive") {
      formData.append(i, JSON.stringify(obj[i]));
    } else if (i === "headliner") {
      formData.append(i, JSON.stringify(obj[i]));
    } else if (i === "productToStreams") {
      for (let a in obj[i]) {
        let value = obj[i][a].productId
          ? { id: obj[i][a].productId, sort: 500 }
          : { id: obj[i][a], sort: 500 };
        formData.append(`${i}[${a}]`, JSON.stringify(value));
        console.log(`${i}[${a}]`, JSON.stringify(value));
      }
    } else if (typeof obj[i] === "object") {
      for (let a in obj[i]) {
        formData.append(`${i}[${a}]`, obj[i][a]);
      }
    } else if (obj[i] && i !== "id") {
      formData.append(i, obj[i]);
    }
  }
  return formData;
}
