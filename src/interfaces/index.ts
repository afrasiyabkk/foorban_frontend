export interface ValidationError {
  target?: object;
  property: string;
  value?: any;
  constraints?: {
      [type: string]: string;
  };
  children?: ValidationError[];
  contexts?: {
  };
}

export interface UpdateInfoRequest {
  name: string;
}

interface BaseResponseInteface {
  success: boolean;
  data?: any;
  errors?: ValidationError[];
}

interface BaseResponseSuccess extends BaseResponseInteface {
  success: true;
  data: any;
}

interface BaseResponseError extends BaseResponseInteface {
  success: false;
  errors: ValidationError[];
}

export type BaseResponse = BaseResponseSuccess | BaseResponseError;


export interface RegisterData {
  name: string,
  age: number | null,
  married: string,
  date_of_birth: Date | null,
}

interface registerResponseSuccess extends BaseResponseInteface {
  success: true;
  data: RegisterData;
}

interface registerResponseError extends BaseResponseInteface {
  success: false;
  errors: ValidationError[];
}

export type registerResponse = registerResponseSuccess | registerResponseError;