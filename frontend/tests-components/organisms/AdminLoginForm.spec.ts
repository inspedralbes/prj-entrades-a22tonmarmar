import { mount } from "@vue/test-utils";
import AdminLoginForm from "@/shared/organisms/AdminLoginForm.vue";

describe("AdminLoginForm", () => {
  it("renders login form", () => {
    const wrapper = mount(AdminLoginForm);
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("shows email and password inputs", () => {
    const wrapper = mount(AdminLoginForm);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it("emits submit with valid credentials", async () => {
    const wrapper = mount(AdminLoginForm);
    await wrapper.find('input[type="email"]').setValue("admin@prova.cat");
    await wrapper.find('input[type="password"]').setValue("passwordSegur!");
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.emitted("submit")).toBeTruthy();
    const emitted = wrapper.emitted("submit");
    expect(emitted[0][0]).toEqual({
      email: "admin@prova.cat",
      password: "passwordSegur!",
    });
  });

  it("shows loading state when loading prop is true", () => {
    const wrapper = mount(AdminLoginForm, {
      props: { loading: true },
    });
    expect(wrapper.text()).toContain("Entrant...");
  });

  it("shows error message when error prop is provided", () => {
    const wrapper = mount(AdminLoginForm, {
      props: { error: "Credencials incorrectes" },
    });
    expect(wrapper.text()).toContain("Credencials incorrectes");
  });

  it("disables button when loading", () => {
    const wrapper = mount(AdminLoginForm, {
      props: { loading: true },
    });
    expect(wrapper.find('button[type="submit"]').attributes("disabled")).toBeDefined();
  });
});
