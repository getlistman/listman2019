import { Handler, Context } from 'aws-lambda';

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e01d6e7abb2343c6b845d4945a368ed55cbf5bd2/types/aws-lambda/index.d.ts#L482
interface Response {
  statusCode: number;
  headers?: {
    [header: string]: boolean | number | string;
  };
  body: string;
}

export const index: Handler = async (event: any = {}, context: Context): Promise<any> => {
  
  const response: Response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: JSON.stringify({
      message2: Math.floor(Math.random() * 10)
    })
  }
  
  return response;
}
