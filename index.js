import { config } from "dotenv";
config();
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: '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',
});

let output;
let date_time = new Date();
let question = "When's the next flight from Mumbai to Bangalore?";

let function_description = [
  {
    name: "get_flight_info",
    description: "get flight information between two locations",
    parameters: {
      type: "object",
      properties: {
        loc_origin: {
          type: "string",
          description: "The deperture airport, e.g. DUS",
        },
        loc_destination: {
          type: "string",
          description: "The destination airport, e.g. HAM",
        },
      },
      required: ["loc_origin", "loc_destination"],
    },
  },
];

function get_flight_info(loc_origin, loc_destination) {
  // console.log(date_time);
  // date_time.setHours(date_time.getHours() + 1000);
  
  
  let flight_info = {
    loc_origin: loc_origin,
    loc_destination: loc_destination,
    datetime: date_time.toString(),
    // airline: "KLM",
    // flight: "KL643",
  };
  console.log(date_time);
  //console.log(flight_info);
  return flight_info;
}

function getFlightData() {
  openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
      functions: function_description,
      function_call: "auto",
    })
    .then((res) => {
       console.log(JSON.parse(res.choices[0].message.function_call.arguments))
      // output = res.choices[0].message;
      // let a = JSON.parse(res.choices[0].message.function_call.arguments);
      // let flight_info = get_flight_info(a.loc_origin, a.loc_destination);
      // getFlightRes(flight_info);
    });
}

function getFlightRes(flight) {

  console.log( "fli ",flight);
  openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "user",
          content: question,
        },
        {
          role: "function",
          name: output?.function_call.name,
          content: `${flight}`,
        },
      ],
      functions: function_description,
      // function_call: "auto",
    })
    .then((res) => console.log(res.choices[0].message));
}

getFlightData();