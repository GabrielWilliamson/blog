---
title: Dynamic inputs using the department and municipality codes of Nicaragua
description: >-
  Using the department and municipality codes of Nicaragua to create a dynamic
  input
category: web-development
date: 2024-10-25
image: >-
  /assets/articles/dynamic-inputs-using-the-department-and-municipality-codes-of-nicaragua/image.avif
draft: false
tools:
  - typescript
  - react
  - vite
  - shadcn
---
![](/assets/articles/dynamic-inputs-using-the-department-and-municipality-codes-of-nicaragua/example.avif)

## Set Up a New Vite Project

Run the following command:

```bash
bun create vite
```

Assign a name to your project and select React as the framework and TypeScript as the variant.
cd nic-departments-input

You can review the [repository](https://github.com/GabrielWilliamson/Departamentos-de-Nic) with the data or clone the [repository with the code](https://github.com/GabrielWilliamson/nic-departments-otp-input.git).

For this project, we will use some components from shadcn/ui and tailwindcss. Make sure to install the necessary dependencies. You can follow this [guide](https://ui.shadcn.com/docs/installation/vite).

The components from shadcn/ui we will use are:

* Input otp
* Form

## Install dependencies

bun install zod
bun install date-fns

> If you manually install the shadcn/ui components, make sure to also install react-hook-form and @hookform/resolvers.

## Use This Command to Get the Department and Municipality Codes

```bash
 curl -o src/data.ts https://raw.githubusercontent.com/GabrielWilliamson/codigos_de_municipios_nicaragua/refs/heads/main/data.ts
```

## Identification Component

Add a new file called `Indentification.tsx` in the components folder

```tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isValid } from "date-fns";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

type Props = {
  onMunicipalityChange: (municipality: string) => void;
  onDateChange: (date: Date | null) => void;
  onFullIdChange: (fullId: string) => void;
  onError: (error: string | null) => void;
  value: string | null;
};

export default function Identification({
  onMunicipalityChange,
  onDateChange,
  onFullIdChange,
  onError,
  value,
}: Props) {
  const formatDateOfBirth = (dateString: string): Date | null => {
    if (dateString.length !== 6) return null;

    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1;
    const year = parseInt(dateString.slice(4), 10);

    if (month < 0 || month > 11 || day < 1 || day > 31) return null;

    const cutoffYear = 30;
    const fullYear = year >= cutoffYear ? year + 1900 : year + 2000;
    const date = new Date(fullYear, month, day);

    return isValid(date) ? date : null;
  };

  const handleChange = (value: string) => {
    onFullIdChange(value);
    const arrayValue = value.split("");

    if (arrayValue.length >= 3) {
      const newMunicipality = arrayValue.slice(0, 3).join("");
      onMunicipalityChange(newMunicipality);
    }

    if (arrayValue.length >= 9) {
      const newDate = arrayValue.slice(3, 9).join("");
      const formattedDate = formatDateOfBirth(newDate);

      if (formattedDate) {
        onDateChange(formattedDate);
        onError(null);
      } else {
        onError("Invalid date of birth.");
      }
    }

    if (arrayValue.length < 14) {
      onError("Invalid Identification.");
    }
  };

  return (
    <InputOTP
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      maxLength={14}
      inputMode="text"
      value={value ?? ""}
      onChange={handleChange}
    >
      <InputOTPGroup>
        {/* Municipality Code */}
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>

      <InputOTPGroup>
        {/* Date of Birth */}
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
        <InputOTPSlot index={6} />
        <InputOTPSlot index={7} />
        <InputOTPSlot index={8} />
      </InputOTPGroup>

      <InputOTPGroup>
        {/* Alphanumeric ID */}
        <InputOTPSlot index={9} />
        <InputOTPSlot index={10} />
        <InputOTPSlot index={11} />
        <InputOTPSlot index={12} />
        <InputOTPSlot index={13} />
      </InputOTPGroup>
    </InputOTP>
  );
}
```

## Schema Validation with Zod

Add a file called `schemas.ts`

```ts
import z from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(10, { message: "Write at least 10 characters" })
    .max(130, { message: "Name is too long" }),
  department: z.string(),
  municipality: z.string(),
  date: z.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minimumDate = new Date(today);
      minimumDate.setFullYear(today.getFullYear() - 16);
      return date <= minimumDate;
    },
    {
      message: "must be over 16 years old",
    }
  ),
  identification: z
    .string()
    .length(16, "complete the identification")
    .refine((value) => /^[A-Za-z]$/.test(value[value.length - 1]), {
      message: "the las character must be a letter",
    })
    .optional()
    .nullable(),
});
export type customer = z.infer<typeof customerSchema>;
```

## Form Component

Create a component for the form `CustomerForm.tsx`

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Indentification from "./Identification";
import { customer, customerSchema } from "../lib/schemas";
import { Input } from "@/components/ui/input";
import { allMunicipalities } from "@/lib/locations";
import { useState } from "react";
import { Button } from "./ui/button";
import { format } from "date-fns";

export default function CustomerForm() {
  const [Identification, setIdentification] = useState<string | null>(null);
  const form = useForm<customer>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      department: "Matagalpa",
      municipality: "Matagalpa",
      name: "",
      date: undefined,
    },
  });

  const handleMunicipalityChange = (code: string) => {
    for (const department of allMunicipalities) {
      const foundMunicipality = department.municipalities.find(
        (municipality) => municipality.code === code
      );

      if (foundMunicipality) {
        form.setValue("department", department.deparmentName);
        form.setValue("municipality", foundMunicipality.name);
      }
    }
  };
  const handleDateChange = (date: Date | null) => {
    if (date === null) return;
    form.setValue("date", date);
  };
  const handleFullIdChange = (fullId: string) => {
    setIdentification(fullId);
    const upperCaseLastChar = fullId.slice(-1).toUpperCase();
    const formattedFullId = fullId.slice(0, -1) + upperCaseLastChar;
    const formattedWithHyphens = `${formattedFullId.slice(
      0,
      3
    )}-${formattedFullId.slice(3, 9)}-${formattedFullId.slice(9)}`;
    form.setValue("identification", formattedWithHyphens);
  };
  const handleErrorChange = (error: string | null) => {
    if (error) {
      form.setError("identification", { type: "custom", message: error });
    } else {
      form.clearErrors("identification");
    }
  };

  const onSubmit = (data: customer) => {
    alert(JSON.stringify(data));
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 mx-3 sm:mx-5 border p-4 sm:p-5  rounded-2xl"

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-1 sm:my1 col-span-1">
                  <FormLabel>Nombres y Apellidos</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      placeholder="Name"
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="my-1 sm:my1 col-span-1">
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input readOnly value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="municipality"
              render={({ field }) => (
                <FormItem className="my-1 sm:my1 col-span-1">
                  <FormLabel>Municipality</FormLabel>
                  <Input readOnly value={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="my-1 sm:my1 col-span-1">
                  <FormLabel>Date of birdth</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      value={
                        field.value ? format(field.value, "dd/MM/yyyy") : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identification"
              render={() => (
                <FormItem className="col-span-3">
                  <FormLabel>Indentification</FormLabel>
                  <FormDescription>
                    write your ID for example: 441-121299-1001F or 001-101087,
                    this identification must be in Nicaraguan format
                  </FormDescription>
                  <FormControl>
                    <Indentification
                      value={Identification ?? ""}
                      onMunicipalityChange={handleMunicipalityChange}
                      onDateChange={handleDateChange}
                      onFullIdChange={handleFullIdChange}
                      onError={handleErrorChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="mt-2" type="submit">
            Save
          </Button>
        </form>
      </Form>
    </>
  );
}
```

## App Component

```tsx
import CustomerForm from "@/components/CustomerForm";

function App() {
  return (
    <div className="flex h-screen flex-col  justify-center items-center">
      <h1 className="text-2xl font-bold">Add a new customer</h1>
      <CustomerForm />
    </div>
  );
}

export default App;
```
