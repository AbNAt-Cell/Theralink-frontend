'use client'
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UpdateClientSignatureFormProps {
  onSignatureUpdate: (signature: string, pin: string) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  pin: z.string().min(4, 'PIN must be at least 4 characters'),
  confirmPin: z.string().min(4, 'PIN must be at least 4 characters'),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

const UpdateClientSignatureForm = ({ onSignatureUpdate, onCancel }: UpdateClientSignatureFormProps) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [brushColor, setBrushColor] = useState('black');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        // Ideally show an error toast here
        alert("Please draw a signature");
        return;
      }
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      onSignatureUpdate(dataURL, values.pin);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Brush Selection */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Brush:</label>
          <Select value={brushColor} onValueChange={setBrushColor}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black"><span className="w-3 h-3 inline-block rounded-full bg-black mr-2"></span> Black</SelectItem>
              <SelectItem value="red"><span className="w-3 h-3 inline-block rounded-full bg-red-500 mr-2"></span> Red</SelectItem>
              <SelectItem value="blue"><span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-2"></span> Blue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative border rounded-md">
          <SignatureCanvas
            ref={sigCanvas}
            penColor={brushColor}
            canvasProps={{
              className: 'sigCanvas w-full h-[300px] border rounded-md bg-white',
            }}
          />
          {/* <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={clearSignature}
            className="absolute bottom-2 right-2 flex items-center gap-2"
          >
            <Eraser className="w-4 h-4" />
            Clear
          </Button> */}
        </div>

        <div className="space-y-4 max-w-md">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Pin</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button className="w-32 bg-blue-900 hover:bg-blue-800 text-white" type="submit">
            Save
          </Button>
          <Button className="w-32" variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateClientSignatureForm;
