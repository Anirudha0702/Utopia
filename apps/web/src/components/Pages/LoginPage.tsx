import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/useApi";
import {
  loginResponseSchema,
  type ApiError,
  type LoginResponse,
} from "@/types/api";
import { LoginFormSchema, type loginTypes } from "@/types/type";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Eye, EyeClosed } from "lucide-react";
import useAuthStore from "@/store/authStore";
import OAuthButtons from "../common/OAuthButtons";
export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth, token } = useAuthStore();
  const form = useForm<loginTypes>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useApiMutation<LoginResponse, loginTypes>(
    {
      endpoint: "/auth/login",
      method: "POST",
      payloadSchema: LoginFormSchema,
      responseSchema: loginResponseSchema,
    },
    {
      onSuccess: (data) => {
        const { user, accessToken } = data.data;

        setAuth({
          token: accessToken,
          user: {
            name: user.name,
            id: user.id,
            email: user.email,
            privacy: user.privacy,
          },
        });
        toast.success(data.message || "Login successful!");
        router.navigate({ to: "/" });
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Login failed. Please try again.");
        console.log(error);
      },
    }
  );

  function onSubmit(data: loginTypes) {
    mutation.mutate(data);
  }
  function showHidePassword() {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    console.log("Token changed:", token);
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
                  className="p-6 md:p-8"
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log("❌ Validation errors:", errors);
                  })}
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
                        Login to Utopia
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="text"
                              placeholder="jhondoe@yourmail"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                      </span>
                    </div>
                    <OAuthButtons />
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <a
                        href="/register"
                        className="underline underline-offset-4"
                      >
                        Sign up
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

export default LoginPage;
