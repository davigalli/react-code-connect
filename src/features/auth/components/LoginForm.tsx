import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const {register,handleSubmit,formState: { errors },} = useForm<LoginFormData>({resolver: zodResolver(loginSchema), mode: "onChange"});

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await authService.login(data);

      setAuth(response);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao fazer login";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-dark-gray p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="font-prompt text-3xl font-semibold text-highlight-green">
          Entrar
        </h1>

        <p className="mt-2 font-prompt text-medium-gray">
          Acesse sua conta no Code Connect
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-prompt text-sm text-medium-gray"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            {...register("email")}
            className="w-full rounded-lg border border-gray bg-graphite px-4 py-3 font-prompt text-white outline-none transition-colors focus:border-highlight-green"
            aria-invalid={!!errors.email}
            disabled={isLoading}
          />

          {errors.email && (
            <p
              className="mt-1 font-prompt text-sm text-red-400"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-prompt text-sm text-medium-gray"
          >
            Senha
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              {...register("password")}
              className="w-full rounded-lg border border-gray bg-graphite px-4 py-3 pr-12 font-prompt text-white outline-none transition-colors focus:border-highlight-green"
              aria-invalid={!!errors.password}
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-gray hover:text-white"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.password && (
            <p
              className="mt-1 font-prompt text-sm text-red-400"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-highlight-green px-6 py-3 font-prompt font-semibold text-graphite transition-colors hover:bg-pastel-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && (
            <Loader2 size={20} className="animate-spin" />
          )}

          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}