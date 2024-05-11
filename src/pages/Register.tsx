import { useEffect, useState } from 'react';
import { BaseResponse, RegisterData, ValidationError } from '../interfaces';

export function Register() {
  const initialRegisterData = {
    name: "",
    age: null,
    married: "",
    date_of_birth: null,
  };

  // all possible errors are in this array
  const validations = ['isNotEmpty', 'isString', 'minLength', 'maxLength', 'isInt', 'min', 'max', 'validateIf', 'isValidDateOfBirth'];

  const [status, setStatus] = useState<'INITIAL' | 'SEND_DATA' | 'SENDING_DATA' | 'DATA_SENDED' | 'ERROR_SENDING_DATA' | 'ERROR' | 'SUCCESS'>();
  const [value, setValue] = useState<string>('');
  const [data , setData] = useState<RegisterData>();

  const [registerData, setRegisterData] = useState<RegisterData>(initialRegisterData);

  const [errorResponse, setErrorResponse] = useState<ValidationError[] | null>(null);

  const inputUpdated = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    var finalValue: number | string | Date = value;
    if (name === "date_of_birth") {
        finalValue = new Date(value);
    }
    if (name === "age") {
        finalValue = parseInt(value);
    }
    console.log("inputUpdate", name, value, event);
    setRegisterData((prevState: RegisterData) => ({
      ...prevState,
      [name]: finalValue,
    }));
  };

  const formatDate = (date: Date | null): string => {
    // formats the date to avoid errors if someone enters invalid date format
    if (date) {
      try {
        const dateStr = new Date(date)?.toISOString()?.substr(0, 10);
        return dateStr;
      } catch (error) {
        console.log(error);
      }
    }
    return "";

  }

  useEffect(() => {
    if(status === 'SEND_DATA') {
      setStatus('SENDING_DATA');
      fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      })
      .then((rawResponse) => {
        if([200, 201].includes(rawResponse.status)) {
          return rawResponse.json();
        } else {
          throw new Error();
        }        
      })
      .then((response: BaseResponse) => {
        setStatus('DATA_SENDED');
        if (response.success) {
          setData(response.data);
          setRegisterData(initialRegisterData); // resets the form
          setStatus("SUCCESS");
        } else {
          setErrorResponse(response.errors);
          setStatus("ERROR");
        }
      })
      .catch(e => {
        setStatus('ERROR_SENDING_DATA');
      })
    }
  }, [status, value]);

  const success_message = () => {
    return (
      <>
        {status === "SUCCESS" &&
          <div className="message success-message">
            <p>
              {(
                "The user " + data?.name +", age: " + data?.age + ", Married: " + data?.married + ", date of birth: " + formatDate(data?.date_of_birth ? data?.date_of_birth : null) + " is successfully registered"
              )}
            </p>
          </div>
        }
      </>
    )
  }

  const error_message = () => {
      return (
        <>
          {status === "ERROR" && 
            <div className="message error-message">
              <ul>
                {errorResponse?.map((error: ValidationError) => (
                  (error?.constraints && validations?.map((val) => (
                    (error?.constraints?.[val] && 
                      <li>{error?.constraints[val]}</li>
                    )
                  )))
                ))}
              </ul>
            </div>
          }

          {status === "ERROR_SENDING_DATA" && 
            <div className="message error-message">
              <ul>
                <li>Something went wrong with the server</li>
              </ul>
            </div>
          }
        </>
      )
  }

  return (
    <div style={{padding: "30px"}}>
      <h1>Register</h1>
      {success_message()}
      {error_message()}
      <label htmlFor="name" style={{fontWeight: "bold"}}>Name</label><br />
      <input 
        id="name"
        type="text" 
        placeholder="Name" 
        name="name"
        value={registerData.name} 
        onChange={inputUpdated} 
      />
      <br />
      <label htmlFor="age" style={{fontWeight: "bold"}}>Age</label><br />
      <input 
        id="age"
        type="number" 
        placeholder="Age"
        name="age"
        value={registerData.age ? registerData.age : ""} 
        onChange={inputUpdated} 
      />
      <br />
      <label htmlFor="married" style={{fontWeight: "bold"}}>Married</label><br />
      <select 
        id="married"
        name="married"
        onChange={inputUpdated}
        value={registerData.married} 
      >
        <option value="none"></option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      <br />
      <label htmlFor="date" style={{fontWeight: "bold"}}>Date of Birth</label><br />
      <input 
        id="date"
        type="date" 
        placeholder="date of birth" 
        name="date_of_birth"
        value={registerData?.date_of_birth ? formatDate(registerData.date_of_birth) : ""} 
        onChange={inputUpdated} 
      />
      <br />

      <br />
      <button onClick={() => setStatus('SEND_DATA')}>Register</button>
    </div>
  );
}
