import { post, RequestCallback, Response } from "request";

export async function postRequest<Payload>(url: string, payload: Payload) {
  return new Promise<Response>((resolve, reject) => {
    const callBack: RequestCallback = (error, response) => {
      if (error) return reject(error);
      return resolve(response);
    };

    post(url, { json: payload, headers: { "content-type": "application/json" } }, callBack);
  });
}
