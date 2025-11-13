import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormSchema,
  otpFormSchema,
  otpVerifySchema,
  verifyUserSchema,
  type OtpFormType,
  type OtpVerifyType,
  type registerTypes,
  type VerifyUserType,
} from "@/types/type";
import { useEffect, useRef, useState } from "react";
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
import { useApiMutation } from "@/hooks/useApi";
import { toast } from "sonner";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  generateOTPResponseSchema,
  registerResponseSchema,
  verifyOTPResponseSchema,
  VerifyUserResponseSchema,
  type ApiError,
  type GenerateOTPResponse,
  type RegisterResponse,
  type VerifyOTPResponse,
  type VerifyUserResponse,
} from "@/types/api";
import OAuthButtons from "../common/OAuthButtons";
import useAuthStore from "@/store/authStore";

export function RegisterPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  type ApiResponse = RegisterResponse;
  const router = useRouter();
  const { token } = useAuthStore();
  const form = useForm<registerTypes>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmpassword: "",
      otp: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const debounceTimeoutRef = useRef<number | null>(null);

  const navigate = useNavigate();

  const profileMutation = useApiMutation<VerifyUserResponse, VerifyUserType>(
    {
      endpoint: "/auth/verify",
      method: "POST",
      payloadSchema: verifyUserSchema,
      responseSchema: VerifyUserResponseSchema,
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || "User verified successfully!");
        navigate({ to: "/login" });
      },

      onError: (error: ApiError) => {
        toast.error(error.message || "Profile setup failed.");
      },
    }
  );
  const mutation = useApiMutation<
    ApiResponse,
    Omit<registerTypes, "confirmpassword" | "otp">
  >(
    {
      endpoint: "/auth/signup",
      method: "POST",
      payloadSchema: FormSchema.omit({ confirmpassword: true, otp: true }),
      responseSchema: registerResponseSchema,
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || "Registration successful!");
        profileMutation.mutate({
          id: data.data.user.id,
        });
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Registration failed. Please try again.");
      },
    }
  );

  const sendOtpMutation = useApiMutation<GenerateOTPResponse, OtpFormType>(
    {
      endpoint: "/otp/generate",
      method: "POST",
      payloadSchema: otpFormSchema,
      responseSchema: generateOTPResponseSchema,
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || "OTP sent successfully!");
        setOtpSent(true);
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Failed to send OTP");
      },
    }
  );
  const verifyOtpMutation = useApiMutation<VerifyOTPResponse, OtpVerifyType>(
    {
      endpoint: "/otp/verify",
      method: "POST",
      payloadSchema: otpVerifySchema,
      responseSchema: verifyOTPResponseSchema,
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || "OTP verified!");
        setOtpVerified(true);
        setOtpSent(false);
        form.setValue("otp", "");
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Invalid OTP, please try again.");
      },
    }
  );
  function onSubmit(data: registerTypes) {
    const { name, email, password } = data;
    mutation.mutate({ name, email, password });
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

  function debounceVerifyOtp(otp: string, email: string) {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    if (!/^[A-Za-z0-9]{6}$/.test(otp) || otp.length !== 6) return;
    debounceTimeoutRef.current = setTimeout(() => {
      verifyOtpMutation.mutate({
        email,
        otp,
      });
    }, 2000);
  }
  useEffect(() => {
    if (token) router.navigate({ to: "/" });
  }, [token]);
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
                        Utopia
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
                            <FormLabel>Email</FormLabel>
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
                                    sendOtpMutation.mutate({
                                      email: field.value,
                                      name: form.getValues("name"),
                                    });
                                  }}
                                />
                                {sendOtpMutation.isPending && (
                                  <div className="absolute inset-y-0 right-3 flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                  </div>
                                )}
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
                                    debounceVerifyOtp(
                                      val,
                                      form.getValues("email")
                                    );
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
                          <FormLabel>Confirm Password</FormLabel>
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
                    <OAuthButtons />
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
                  <span>Boost you work flow with Utopia</span>
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
