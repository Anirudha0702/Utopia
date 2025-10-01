import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, type RegisterForm } from "@/types/type";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

export function RegisterPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmpassword: "",
      otp: "",
    },
  });
  function onSubmit(data: RegisterForm) {
    const { name, email, password } = data;
  }
  function handleEditEmail() {
    setOtpSent(false);
    setOtpVerified(false);
    form.setValue("otp", "");
    form.setValue("email", "");
  }
  function showHidePassword() {
    setShowPassword(!showPassword);
  }
  function showHideConfirmPassword() {
    setConfirmPassword(!confirmPassword);
  }
  return (
    <div className=" bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log("❌ Validation errors:", errors);
                  })}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold flex items-center gap-2">
                        <img
                          src="/images/logo.png"
                          height="50px"
                          width="50px"
                        />
                        Velora
                      </h1>
                      <p className="text-muted-foreground text-balance">
                        Create a new account
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Jhon Doe"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {!otpSent && (
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="email"
                                  placeholder="jhondoe@email.com"
                                  {...field}
                                  readOnly={otpVerified}
                                  onBlur={() => {
                                    if (otpVerified || !field.value || otpSent)
                                      return;
                                    // sendOtpMutation.mutate({
                                    //   email: field.value,
                                    //   username: form.getValues("username"),
                                    // });
                                  }}
                                />
                                {/* {sendOtpMutation.isPending && (
                              <div className="absolute inset-y-0 right-3 flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                              </div>
                            )} */}
                                {otpVerified && (
                                  <span
                                    className="text-primary hover:underline font-medium text-sm cursor-pointer inline-block"
                                    onClick={handleEditEmail}
                                  >
                                    Edit Email?
                                  </span>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {otpSent && !otpVerified && (
                      <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Enter OTP
                            </FormLabel>
                            <FormControl>
                              <div className="">
                                <InputOTP
                                  maxLength={6}
                                  {...field}
                                  className="w-full"
                                  onChange={(val: string) => {
                                    field.onChange(val);
                                    if (val.length === 6) {
                                      // verifyOtpMutation.mutate({
                                      //   email: form.getValues("email"),
                                      //   otp: val,
                                      // });
                                    }
                                  }}
                                >
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                  </InputOTPGroup>
                                  <InputOTPSeparator />
                                  <InputOTPGroup>
                                    <InputOTPSlot index={2} />

                                    <InputOTPSlot index={3} />
                                  </InputOTPGroup>
                                  <InputOTPSeparator />
                                  <InputOTPGroup>
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                  </InputOTPGroup>
                                </InputOTP>
                                <span
                                  className="text-primary hover:underline font-medium text-sm cursor-pointer inline-block"
                                  onClick={handleEditEmail}
                                >
                                  Edit Email?
                                </span>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div>
                              <Input
                                type={!showPassword ? "password" : "text"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <div className=" relative bottom-8 left-11/12 h-1 cursor-pointer">
                                {showPassword ? (
                                  <Eye
                                    className=" w-3"
                                    onClick={showHidePassword}
                                  />
                                ) : (
                                  <EyeClosed
                                    className="w-3"
                                    onClick={showHidePassword}
                                  />
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmpassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div>
                              <Input
                                type={confirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <div className=" relative bottom-8 left-11/12 h-1 cursor-pointer ">
                                {confirmPassword ? (
                                  <Eye
                                    className=" w-3"
                                    onClick={showHideConfirmPassword}
                                  />
                                ) : (
                                  <EyeClosed
                                    className="w-3"
                                    onClick={showHideConfirmPassword}
                                  />
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="custom" type="button" className="w-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="sr-only">Login with Google</span>
                      </Button>
                      <Button variant="custom" type="button" className="w-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.302 
       3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 
       0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61 
       -.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 
       1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997 
       .108-.775.419-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.931 
       0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 
       0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 6.004 0c2.292-1.552 
       3.299-1.23 3.299-1.23.653 1.652.241 2.873.118 3.176.77.84 
       1.235 1.911 1.235 3.221 0 4.609-2.804 5.625-5.475 5.921 
       .43.371.823 1.103.823 2.222 0 1.604-.014 2.896-.014 3.286 
       0 .318.218.694.825.576C20.565 22.092 24 17.593 24 12.297 
       24 5.67 18.627.297 12 .297z"
                          />
                        </svg>

                        <span className="sr-only">Login with Github</span>
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <a href="/login" className="underline underline-offset-4">
                        Login
                      </a>
                    </div>
                  </div>
                </form>
              </Form>
              <div className=" relative hidden md:block p-2">
                <img
                  src="/images/login-bg.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="w-full  absolute z-10 bottom-10 text-center  text-lg font-bold  drop-shadow-lg">
                  <span>Boost you work flow with Velora</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
