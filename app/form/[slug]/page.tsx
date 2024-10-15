"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";


import { Form } from "@/components/Form";
import { TextField } from "@/components/TextFields";
import { Button } from "@/components/Button";

declare const window: any;

type FormField = {
  title: number;
};

type FormFieldProps = {
  formFields: FormField[];
};

export default function Home() {
  const [required, setRequired] = useState<Record<string, any>>({});
  const [formFields, setFormFields] = useState<FormFieldProps["formFields"]>(
    []
  );

  const { slug } = useParams();

  useEffect(() => {
    getSchemaDataHandler();
  }, []);


  const getSchemaDataHandler = async () => {
    try {
      const responseFromSchemaList = await fetch(`/vc/schemas/${slug}.json`);

      if (responseFromSchemaList.ok) {
        const schemaLists = await responseFromSchemaList.json();

        const credentialProperties = schemaLists.properties.credentialSubject.properties;
        const requiredFields = schemaLists.properties.credentialSubject.required;

        // Mapped the required properties
        const requiredPropertyFields = requiredFields.map(
          (fieldIndex: number) => ({
            [fieldIndex]: credentialProperties[fieldIndex],
          })
        );
        setRequired(requiredPropertyFields);

        // Filter out the non-required fields
        const nonRequiredPropertyFields = Object.keys(credentialProperties)
          .filter((field) => !requiredFields.includes(field))
          .map((field) => ({
            [field]: credentialProperties[field],
          }));

        const formFields = [
          requiredPropertyFields,
          nonRequiredPropertyFields
        ].flat();
        setFormFields(formFields);
      } else {
        throw new Error("No Data Fetch");
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleSubmit = (values: any) => {
    if(window.ReactNativeWebView) return window.ReactNativeWebView?.postMessage(JSON.stringify(values));

    return alert(JSON.stringify(values));
};


  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Form onSubmit={handleSubmit}>
        {({ submitting, values }) => (
          <div className="grid mt-2 gap-5 p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
            {formFields.map((field, index) => {
              const fieldName = Object.keys(field)[0];
              const fieldDetails = field[fieldName];
              const isRequired = required.some(
                (reqField : any) => Object.keys(reqField)[0] === fieldName
              );
              return (
                <TextField
                  required={isRequired}
                  key={index}
                  name={fieldDetails.title}
                  caption={fieldDetails.title}
                />
              );
            })}
            <Button  type="submit" disabled={submitting}>
              Submit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
