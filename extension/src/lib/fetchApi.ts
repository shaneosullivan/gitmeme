interface BagOfStuff {
  [key: string]: string | number | any;
}

export default function fetchApi(
  url: string,
  body: BagOfStuff | FormData,
  headers?: BagOfStuff
) {
  const isFormData = body instanceof FormData;

  const headerToUse = {
    ...(headers || {}),
  };

  if (!isFormData) {
    headerToUse["Content-Type"] = "application/json";
    headerToUse["Accept"] = "application/json";
  } else {
    delete headerToUse["Content-Type"];
  }

  return fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: headerToUse,
    body: isFormData ? body : JSON.stringify(body),
  });
}
