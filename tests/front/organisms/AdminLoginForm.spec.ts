import { mount } from "@vue/test-utils";
import AdminLoginForm from "@/shared/organisms/AdminLoginForm.vue";

// Test bàsic d'AdminLoginForm

describe("AdminLoginForm", () => {
  it("mostra el formulari de login", () => {
    const wrapper = mount(AdminLoginForm);
    expect(wrapper.find("form").exists()).toBe(true);
  });

  // Arrange: preparar credencials de prova
  it("emeteix event de login amb dades vàlides", async () => {
    const wrapper = mount(AdminLoginForm);
    await wrapper.find("input[name=email]").setValue("admin@prova.cat");
    await wrapper.find("input[name=password]").setValue("passwordSegur!");
    await wrapper.find("form").trigger("submit.prevent");
    // Assert: comprovar que s'ha emès l'event de login
    expect(wrapper.emitted("login")).toBeTruthy();
  });
});
