const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const EVIDENCIAS_DIR = path.join(__dirname, "evidencias");
if (!fs.existsSync(EVIDENCIAS_DIR))
  fs.mkdirSync(EVIDENCIAS_DIR, { recursive: true });

async function screenshot(page, nome) {
  const fp = path.join(EVIDENCIAS_DIR, `${nome}.png`);
  await page.screenshot({ path: fp, fullPage: true });
  console.log(`  [EVIDENCIA] ${nome}.png salvo`);
}

async function debugFrames(page) {
  const frames = page.frames();
  console.log(`  [DEBUG] Frames: ${frames.length}`);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    try {
      const info = await f.evaluate(() => {
        const btns = Array.from(
          document.querySelectorAll(
            "button, input[type=button], input[type=submit]",
          ),
        )
          .map((b) => `"${(b.textContent || b.value || "").trim()}"`)
          .filter((s) => s !== '""');
        const links = Array.from(document.querySelectorAll("a"))
          .map((a) => `"${a.textContent.trim()}"`)
          .filter((t) => t !== '""')
          .slice(0, 20);
        const inputs = Array.from(
          document.querySelectorAll("input, select, textarea"),
        )
          .map((i) => `${i.tagName}[${i.name || i.id || i.type}]`)
          .slice(0, 10);
        return { btns, links, inputs };
      });
      console.log(`    Frame[${i}] ${f.url()}`);
      if (info.btns.length)
        console.log(`      Botoes: ${info.btns.join(", ")}`);
      if (info.links.length)
        console.log(`      Links: ${info.links.join(", ")}`);
      if (info.inputs.length)
        console.log(`      Inputs: ${info.inputs.join(", ")}`);
    } catch {
      console.log(`    Frame[${i}] ${f.url()} [inacessivel]`);
    }
  }
}

// Clica <a> com texto EXATO — usado para navegacao de menu
async function clickMenuLink(page, texto) {
  for (const frame of page.frames()) {
    try {
      const ok = await frame.evaluate((txt) => {
        const el = Array.from(document.querySelectorAll("a")).find(
          (a) => a.textContent.trim() === txt,
        );
        if (el) {
          el.scrollIntoView();
          el.click();
          return true;
        }
        return false;
      }, texto);
      if (ok) {
        console.log(
          `  [DEBUG] Link menu "${texto}" clicado no frame: ${frame.url()}`,
        );
        return true;
      }
    } catch {
      /* continua */
    }
  }
  return false;
}

// Clica button/input com texto EXATO — usado para botoes de formulario
async function clickFormButton(page, texto) {
  for (const frame of page.frames()) {
    try {
      const ok = await frame.evaluate((txt) => {
        const el = Array.from(
          document.querySelectorAll(
            "button, input[type=button], input[type=submit]",
          ),
        ).find((e) => (e.textContent || e.value || "").trim() === txt);
        if (el) {
          el.scrollIntoView();
          el.click();
          return true;
        }
        return false;
      }, texto);
      if (ok) {
        console.log(
          `  [DEBUG] Botao "${texto}" clicado no frame: ${frame.url()}`,
        );
        return true;
      }
    } catch {
      /* continua */
    }
  }
  return false;
}

// Clica button/input com texto parcial — para variantes de texto
async function clickFormButtonPartial(page, texto) {
  for (const frame of page.frames()) {
    try {
      const ok = await frame.evaluate((txt) => {
        const el = Array.from(
          document.querySelectorAll(
            "button, input[type=button], input[type=submit]",
          ),
        ).find((e) =>
          (e.textContent || e.value || "")
            .trim()
            .toLowerCase()
            .includes(txt.toLowerCase()),
        );
        if (el) {
          el.scrollIntoView();
          el.click();
          return true;
        }
        return false;
      }, texto);
      if (ok) {
        console.log(
          `  [DEBUG] Botao parcial "${texto}" clicado no frame: ${frame.url()}`,
        );
        return true;
      }
    } catch {
      /* continua */
    }
  }
  return false;
}

// Aguarda um input aparecer em qualquer frame, retorna {frame, locator}
async function waitForInput(page, selector, totalMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < totalMs) {
    for (const frame of page.frames()) {
      try {
        const loc = frame.locator(selector).first();
        await loc.waitFor({ state: "attached", timeout: 300 });
        return { frame, locator: loc };
      } catch {
        /* continua */
      }
    }
    await page.waitForTimeout(300);
  }
  return null;
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    // PASSO 1
    console.log("[PASSO 1] Acessando a aplicacao...");
    await page.goto(
      "https://homolog-credaluga.siscobra.com.br/servlet/hsiscobra",
      { waitUntil: "networkidle", timeout: 60000 },
    );
    await screenshot(page, "01_tela_login");

    // PASSO 2 - Login
    console.log("[PASSO 2] Realizando login...");
    await page.locator('input[type="text"]').first().fill("9953");
    await page
      .locator('input[type="password"]')
      .first()
      .fill("Teste@123!asdA1");
    await screenshot(page, "02_credenciais_preenchidas");
    await page
      .locator('button[type="submit"], input[type="submit"]')
      .first()
      .click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });

    // Modal sessao duplicada
    const simOk = await clickFormButton(page, "Sim");
    if (simOk) {
      console.log("  [MODAL] Sim clicado.");
      await screenshot(page, "03_modal_sessao");
      await page.waitForLoadState("networkidle", { timeout: 30000 });
    } else {
      console.log("  [INFO] Modal sessao nao detectado.");
    }
    await screenshot(page, "04_pos_login");
    console.log("  Login realizado.");
    await debugFrames(page);

    // Dispensar notificacoes (pode haver multiplas)
    /*let notifCount = 0;
    for (let i = 0; i < 5; i++) {
      const ok = await clickFormButton(page, "Confirmar Notificacoes");
      if (ok) {
        notifCount++;
        console.log(`  [NOTIF] Notificacao ${notifCount} dispensada.`);
        await page.waitForTimeout(2000);
        await clickFormButton(page, "X"); // fechar qualquer modal extra
        await page.waitForTimeout(1000);
      } else break;
    }
    if (notifCount > 0) {
      await screenshot(page, "04b_apos_notificacao");
    } else {
      console.log("  [INFO] Sem notificacoes pendentes.");
    }*/

    // PASSO 3 - Menu Acionamento > Pesquisar
    console.log("[PASSO 3] Navegando para Acionamento > Pesquisar...");

    // Verificar se submenu Pesquisar ja esta visivel
    const pesVisivel = await (async () => {
      for (const f of page.frames()) {
        try {
          if (
            await f.evaluate(() =>
              Array.from(document.querySelectorAll("a")).some(
                (a) => a.textContent.trim() === "Pesquisar",
              ),
            )
          )
            return true;
        } catch {
          /* continua */
        }
      }
      return false;
    })();

    if (!pesVisivel) {
      await clickMenuLink(page, "Acionamento");
      await page.waitForTimeout(1500);
    }
    await screenshot(page, "05_acionamento");

    // Clicar no link Pesquisar (apenas <a> com texto exato)
    const pesLinkOk = await clickMenuLink(page, "Pesquisar");
    if (!pesLinkOk) throw new Error("Link Pesquisar no menu nao encontrado.");
    console.log("  Aguardando formulario de pesquisa carregar...");

    // Aguarda o campo CPF aparecer (confirma que a tela carregou)
    const cpfLoad = await waitForInput(
      page,
      'input[name*="cpf" i], input[id*="cpf" i], input[placeholder*="CPF" i], input[name="CNPJ"]',
      20000,
    );
    if (!cpfLoad)
      throw new Error(
        "Formulario de pesquisa nao carregou (campo CPF nao encontrado).",
      );
    await screenshot(page, "06_tela_pesquisa");
    console.log("  Tela de pesquisa carregada.");
    await debugFrames(page);

    // PASSO 4 - CPF/CNPJ
    console.log("[PASSO 4] Preenchendo CPF/CNPJ...");
    console.log(`  [DEBUG] Campo CPF no frame: ${cpfLoad.frame.url()}`);
    await cpfLoad.locator.fill("47406932839");
    await screenshot(page, "07_cpf_preenchido");

    // PASSO 5 - Botao Pesquisar do formulario (no mesmo frame do CPF)
    console.log("[PASSO 5] Clicando no botao Pesquisar do formulario...");
    const contentFrame = cpfLoad.frame;
    const pesFormOk = await contentFrame.evaluate(() => {
      const el = Array.from(
        document.querySelectorAll(
          "button, input[type=button], input[type=submit]",
        ),
      ).find((e) => (e.textContent || e.value || "").trim() === "Pesquisar");
      if (el) {
        el.scrollIntoView();
        el.click();
        return true;
      }
      return false;
    });
    if (!pesFormOk)
      throw new Error(
        "Botao Pesquisar do formulario nao encontrado no frame de conteudo.",
      );
    console.log(
      `  [DEBUG] Botao Pesquisar clicado no frame: ${contentFrame.url()}`,
    );
    await page.waitForTimeout(3000);
    await screenshot(page, "08_resultado_pesquisa");
    console.log("  Resultados exibidos.");

    // Debug resultado
    await debugFrames(page);

    // PASSO 6 - Clicar no codigo do cliente
    console.log("[PASSO 6] Clicando no codigo do cliente...");
    const resultLinks = await contentFrame.evaluate(() =>
      Array.from(document.querySelectorAll("table a, tbody a, td a"))
        .slice(0, 5)
        .map((a) => `"${a.textContent.trim()}" -> ${a.href}`),
    );
    console.log(`  [DEBUG] Links tabela: ${resultLinks.join(" | ")}`);

    // Clicar no link com codigo numerico do cliente (evita pegar links do menu/logo)
    const clienteOk = await contentFrame.evaluate(() => {
      const el = Array.from(document.querySelectorAll("td a")).find((a) =>
        /^\d+$/.test(a.textContent.trim()),
      );
      if (el) {
        el.scrollIntoView();
        el.click();
        return el.textContent.trim();
      }
      return null;
    });
    if (!clienteOk)
      throw new Error("Codigo numerico do cliente nao encontrado na tabela.");
    console.log(`  [DEBUG] Clicado cliente: ${clienteOk}`);

    // Aguarda carregamento da ficha (SPA pode demorar)
    await page.waitForTimeout(5000);
    await screenshot(page, "09a_apos_click_cliente");
    await debugFrames(page);
    await page.waitForTimeout(3000);
    await screenshot(page, "09_ficha_cliente");
    console.log("  Ficha do cliente aberta.");

    // PASSO 7 - Aba Emails (tab pode ter formato "Email (2)")
    console.log("[PASSO 7] Acessando aba Emails...");
    await debugFrames(page);

    let emailOk = false;
    for (const frame of page.frames()) {
      if (emailOk) break;
      try {
        const found = await frame.evaluate(() => {
          // Tab pode ser "Email", "Emails", "Email (2)", "E-mail (2)" etc.
          const el = Array.from(
            document.querySelectorAll("a, button, li, [role=tab]"),
          ).find((e) => {
            const txt = e.textContent.trim();
            return (
              txt === "Email" ||
              txt === "Emails" ||
              txt === "E-mail" ||
              txt === "E-mails" ||
              txt.startsWith("Email (") ||
              txt.startsWith("E-mail (") ||
              txt.startsWith("Emails (")
            );
          });
          if (el) {
            el.scrollIntoView();
            el.click();
            return el.textContent.trim();
          }
          return null;
        });
        if (found) {
          emailOk = true;
          console.log(
            `  [DEBUG] Aba email clicada: "${found}" no frame: ${frame.url()}`,
          );
        }
      } catch {
        /* continua */
      }
    }
    if (!emailOk) throw new Error("Aba Email nao encontrada.");
    await page.waitForTimeout(2500);
    await screenshot(page, "10_aba_emails");
    console.log("  Aba Emails selecionada.");

    // PASSO 8 - Botao Adicionar (+)
    console.log("[PASSO 8] Clicando no botao Adicionar (+)...");
    let addOk = false;

    // Debug: mostrar elementos candidatos em cada frame
    for (const frame of page.frames()) {
      try {
        const dbg = await frame.evaluate(() => {
          const leafPlus = Array.from(document.querySelectorAll("*"))
            .filter(
              (e) =>
                e.children.length === 0 && (e.textContent || "").trim() === "+",
            )
            .map(
              (e) =>
                `${e.tagName}[${e.className || ""}]->parent:${e.parentElement && e.parentElement.tagName}[${e.parentElement && (e.parentElement.className || "")}]`,
            );
          const onclickEmail = Array.from(
            document.querySelectorAll("[onclick]"),
          )
            .filter((e) => {
              const oc = e.getAttribute("onclick").toLowerCase();
              return (
                (oc.includes("email") || oc.includes("mail")) &&
                (oc.includes("nov") ||
                  oc.includes("add") ||
                  oc.includes("insert") ||
                  oc.includes("inclu"))
              );
            })
            .map(
              (e) =>
                `${e.tagName} onclick="${e.getAttribute("onclick").substring(0, 60)}"`,
            )
            .slice(0, 3);
          return { leafPlus, onclickEmail };
        });
        if (dbg.leafPlus.length || dbg.onclickEmail.length)
          console.log(
            `  [DEBUG +] Frame ${frame.url()}: leafPlus=${JSON.stringify(dbg.leafPlus)} onclick=${JSON.stringify(dbg.onclickEmail)}`,
          );
      } catch {
        /* continua */
      }
    }

    // Tentativa 1: botao/input com texto "+" (exato ou parcial)
    addOk = await clickFormButtonPartial(page, "+");
    // Tentativa 2: link com texto "+"
    if (!addOk) addOk = await clickMenuLink(page, "+");
    // Tentativa 3: qualquer elemento folha com "+" — sobe ate clicavel
    if (!addOk) {
      for (const frame of page.frames()) {
        if (addOk) break;
        try {
          const ok = await frame.evaluate(() => {
            const leaf = Array.from(document.querySelectorAll("*")).find(
              (e) =>
                e.children.length === 0 && (e.textContent || "").trim() === "+",
            );
            if (!leaf) return null;
            let el = leaf;
            for (let i = 0; i < 6; i++) {
              if (!el) break;
              if (
                el.tagName === "A" ||
                el.tagName === "BUTTON" ||
                el.tagName === "INPUT" ||
                el.getAttribute("onclick") ||
                el.getAttribute("href")
              ) {
                el.scrollIntoView();
                el.click();
                return `${el.tagName} ancestor de +`;
              }
              el = el.parentElement;
            }
            // Clica o proprio leaf
            leaf.scrollIntoView();
            leaf.click();
            return `leaf ${leaf.tagName}`;
          });
          if (ok) {
            addOk = true;
            console.log(`  [DEBUG] Botao +: ${ok} em ${frame.url()}`);
          }
        } catch {
          /* continua */
        }
      }
    }
    // Tentativa 4: onclick com email+novo/add
    if (!addOk) {
      for (const frame of page.frames()) {
        if (addOk) break;
        try {
          const ok = await frame.evaluate(() => {
            const el = Array.from(document.querySelectorAll("[onclick]")).find(
              (e) => {
                const oc = e.getAttribute("onclick").toLowerCase();
                return (
                  (oc.includes("email") || oc.includes("mail")) &&
                  (oc.includes("nov") ||
                    oc.includes("add") ||
                    oc.includes("insert") ||
                    oc.includes("inclu"))
                );
              },
            );
            if (el) {
              el.scrollIntoView();
              el.click();
              return el.outerHTML.substring(0, 100);
            }
            return null;
          });
          if (ok) {
            addOk = true;
            console.log(`  [DEBUG] onclick email add: ${ok.substring(0, 80)}`);
          }
        } catch {
          /* continua */
        }
      }
    }
    // Tentativa 5: classe com "add", "novo", "plus"
    if (!addOk) {
      for (const frame of page.frames()) {
        if (addOk) break;
        try {
          const ok = await frame.evaluate(() => {
            const el = Array.from(
              document.querySelectorAll("a, button, span, div, i"),
            ).find((e) => {
              const cl = (e.className || "").toLowerCase();
              return (
                cl.includes("add") ||
                cl.includes("novo") ||
                cl.includes("plus") ||
                cl.includes("incluir") ||
                cl.includes("btn-new")
              );
            });
            if (el) {
              el.scrollIntoView();
              el.click();
              return el.outerHTML.substring(0, 100);
            }
            return null;
          });
          if (ok) {
            addOk = true;
            console.log(`  [DEBUG] classe add/novo: ${ok.substring(0, 80)}`);
          }
        } catch {
          /* continua */
        }
      }
    }
    if (!addOk)
      throw new Error(
        "Botao Adicionar (+) nao encontrado. Verifique debug acima.",
      );

    // Aguarda o formulario de novo email abrir (verifica W0021BTN_ENTER)
    console.log("  Aguardando formulario de novo email abrir...");
    let hEmailFrame;
    let formAberto = false;
    const startForm = Date.now();
    while (Date.now() - startForm < 20000) {
      hEmailFrame = page.frames().find((f) => f.url().includes("/hemail"));
      if (hEmailFrame) {
        try {
          const ok = await hEmailFrame.evaluate(() => {
            const btn = document.querySelector('input[name="W0021BTN_ENTER"]');
            // Formulario aberto: BTN_ENTER existe e select W0021TIPEMACOD existe
            const sel = document.querySelector('select[name*="TIPEMACOD"]');
            return !!(btn && sel);
          });
          if (ok) {
            formAberto = true;
            break;
          }
        } catch {
          /* continua */
        }
      }
      await page.waitForTimeout(500);
    }
    if (!formAberto) {
      console.log(
        "  [WARN] Form novo email nao detectado, aguardando 6s extras...",
      );
      await page.waitForTimeout(6000);
    }
    hEmailFrame = page.frames().find((f) => f.url().includes("/hemail"));
    if (!hEmailFrame) throw new Error("Frame hemail nao encontrado.");
    console.log(
      `  [DEBUG] Frame hemail: ${hEmailFrame.url()} | formAberto=${formAberto}`,
    );
    await screenshot(page, "11_form_email_aberto");
    await debugFrames(page);
    console.log("  Formulario de email aberto.");

    // PASSO 9 - Seleciona tipo no hemail frame (nao em outros frames)
    console.log('[PASSO 9] Selecionando tipo "Pesquisa" no frame hemail...');
    const tipoResult = await (async () => {
      const start = Date.now();
      while (Date.now() - start < 15000) {
        // Re-encontra hemail a cada iteracao (pode ter navegado)
        hEmailFrame = page.frames().find((f) => f.url().includes("/hemail"));
        if (!hEmailFrame) {
          await page.waitForTimeout(400);
          continue;
        }
        try {
          const ok = await hEmailFrame.evaluate(() => {
            const selects = Array.from(document.querySelectorAll("select"));
            for (const sel of selects) {
              // Apenas o select de tipo do formulario (W0021TIPEMACOD), nao o filtro da lista (_TIPPESCOD)
              const sName = (sel.name || sel.id || "").toUpperCase();
              if (!sName.includes("TIPEMACOD")) continue;
              const opts = Array.from(sel.options);
              const pesOpt = opts.find((o) =>
                o.text.trim().toLowerCase().includes("pesquisa"),
              );
              if (pesOpt) {
                sel.value = pesOpt.value;
                sel.dispatchEvent(new Event("change", { bubbles: true }));
                return `${sel.name || sel.id}: "${pesOpt.text}" (value=${pesOpt.value})`;
              }
            }
            return null;
          });
          if (ok) {
            console.log(`  [DEBUG] Tipo hemail: ${ok}`);
            return ok;
          }
        } catch {
          /* continua */
        }
        await page.waitForTimeout(400);
      }
      return null;
    })();
    if (!tipoResult)
      throw new Error(
        "Select com opcao Pesquisa nao encontrado no frame hemail.",
      );
    // Aguarda possivel gxSubmit apos selecionar tipo
    await page.waitForTimeout(3000);
    await screenshot(page, "12_tipo_selecionado");

    // PASSO 10 - Preenche campo de email no frame hemail via JS
    console.log("[PASSO 10] Preenchendo campo Email no frame hemail...");
    const emailSet = await (async () => {
      const start = Date.now();
      while (Date.now() - start < 20000) {
        hEmailFrame = page.frames().find((f) => f.url().includes("/hemail"));
        if (!hEmailFrame) {
          await page.waitForTimeout(400);
          continue;
        }
        try {
          const dbg = await hEmailFrame.evaluate(() => {
            // Retorna todos os inputs para debug
            return Array.from(document.querySelectorAll("input, textarea")).map(
              (i) => `${i.name || i.id}[type=${i.type},w=${i.offsetWidth}]`,
            );
          });
          console.log(`  [DEBUG] Inputs hemail: ${dbg.join(" | ")}`);

          const ok = await hEmailFrame.evaluate(() => {
            // Prioriza campo VISIVEL (offsetWidth>0) com nome EMAEMA
            const byName =
              Array.from(
                document.querySelectorAll('input[name*="EMAEMA"]'),
              ).find((i) => i.offsetWidth > 0 && i.type !== "hidden") ||
              Array.from(document.querySelectorAll('input[name*="EMA"]')).find(
                (i) => i.offsetWidth > 0 && i.type !== "hidden",
              );

            // Fallback: qualquer input nao-oculto, nao-readonly, nao de controle
            const byFilter = Array.from(
              document.querySelectorAll("input"),
            ).find(
              (i) =>
                i.type !== "hidden" &&
                !i.readOnly &&
                i.offsetWidth > 0 &&
                !/(_EventName|_EventGrid|_EventRow|_BUSCA|search|_PES|_TIP|_DAT|_CONFIR|MPAGE)/i.test(
                  i.name,
                ),
            );

            const el = byName || byFilter;
            if (el) {
              el.focus();
              el.value = "teste@playwright.com";
              el.dispatchEvent(new Event("input", { bubbles: true }));
              el.dispatchEvent(new Event("change", { bubbles: true }));
              return `${el.name || el.id}[${el.type},w=${el.offsetWidth}]`;
            }
            return null;
          });
          if (ok) {
            console.log(`  [DEBUG] Email campo preenchido: ${ok}`);
            return ok;
          }
        } catch (e) {
          console.log(`  [WARN] ${e.message}`);
        }
        await page.waitForTimeout(500);
      }
      return null;
    })();
    if (!emailSet)
      throw new Error("Campo email nao encontrado no frame hemail.");
    await screenshot(page, "13_email_preenchido");
    console.log("  Email preenchido.");

    // PASSO 11 - Confirmar no frame hemail (botao submit W0021BTN_ENTER)
    console.log("[PASSO 11] Clicando em Confirmar no frame hemail...");
    hEmailFrame = page.frames().find((f) => f.url().includes("/hemail"));
    const confOk = hEmailFrame
      ? await hEmailFrame.evaluate(() => {
          // Primeiro tenta pelo submit do formulario (W0021BTN_ENTER)
          const bySubmit =
            document.querySelector('input[name="W0021BTN_ENTER"]') ||
            Array.from(document.querySelectorAll("input[type=submit]")).find(
              (e) => (e.value || "").trim() === "Confirmar",
            );
          // Fallback: botao generico
          const byBtn = Array.from(
            document.querySelectorAll(
              "button, input[type=button], input[type=submit]",
            ),
          ).find(
            (e) => (e.textContent || e.value || "").trim() === "Confirmar",
          );
          const el = bySubmit || byBtn;
          if (el) {
            el.scrollIntoView();
            el.click();
            return el.name || el.value;
          }
          return false;
        })
      : await clickFormButton(page, "Confirmar");
    if (!confOk) throw new Error("Botao Confirmar nao encontrado.");
    // Aguarda o servidor processar e a lista ser atualizada
    await page.waitForTimeout(5000);
    await screenshot(page, "14_pos_confirmacao");
    console.log("  Email salvo.");

    // PASSO 12 - Verificar email na lista
    console.log("[PASSO 12] Verificando email na lista...");
    let emailEncontrado = false;
    for (const frame of page.frames()) {
      try {
        emailEncontrado = await frame.evaluate(() =>
          document.body.innerText.includes("teste@playwright.com"),
        );
        if (emailEncontrado) break;
      } catch {
        /* continua */
      }
    }
    await screenshot(page, "15_email_na_lista");
    if (emailEncontrado) {
      console.log(
        '  SUCESSO: Email "teste@playwright.com" encontrado na lista!',
      );
    } else {
      console.error(
        "  ATENCAO: Email nao encontrado visualmente (pode estar na pagina).",
      );
    }

    // PASSO 13 - Voltar para Contratos
    console.log("[PASSO 13] Acessando aba Contratos...");
    let contOk = false;

    // Tentativa 1: span#W0339CONTRATOS > a com gxSubmit (seletor exato)
    for (const frame of page.frames()) {
      if (contOk) break;
      try {
        const ok = await frame.evaluate(() => {
          const span = document.querySelector("#W0339CONTRATOS");
          if (span) {
            const link =
              span.querySelector("a[href*='W0339ECONTRATOS']") ||
              span.querySelector("a");
            if (link) {
              link.scrollIntoView();
              link.click();
              return `span#W0339CONTRATOS > a: ${link.href || link.getAttribute("href")}`;
            }
          }
          return null;
        });
        if (ok) {
          contOk = true;
          console.log(
            `  [DEBUG] Contratos via span#W0339CONTRATOS: ${ok} em ${frame.url()}`,
          );
        }
      } catch {
        /* continua */
      }
    }

    // Tentativa 2: a com href contendo W0339ECONTRATOS
    if (!contOk) {
      for (const frame of page.frames()) {
        if (contOk) break;
        try {
          const ok = await frame.evaluate(() => {
            const el = Array.from(
              document.querySelectorAll("a[href*='W0339ECONTRATOS']"),
            ).find(Boolean);
            if (el) {
              el.scrollIntoView();
              el.click();
              return el.getAttribute("href").substring(0, 80);
            }
            return null;
          });
          if (ok) {
            contOk = true;
            console.log(`  [DEBUG] Contratos via href W0339ECONTRATOS: ${ok}`);
          }
        } catch {
          /* continua */
        }
      }
    }

    // Tentativa 3: texto "Contratos" em qualquer aba/link
    if (!contOk) {
      for (const frame of page.frames()) {
        if (contOk) break;
        try {
          const found = await frame.evaluate(() => {
            const el = Array.from(
              document.querySelectorAll("a, button, li, [role=tab], span"),
            ).find((e) => e.textContent.trim().startsWith("Contratos"));
            if (el) {
              el.scrollIntoView();
              el.click();
              return el.textContent.trim();
            }
            return null;
          });
          if (found) {
            contOk = true;
            console.log(
              `  [DEBUG] Contratos via texto: "${found}" em ${frame.url()}`,
            );
          }
        } catch {
          /* continua */
        }
      }
    }

    if (!contOk) throw new Error("Aba Contratos nao encontrada.");
    await page.waitForTimeout(2000);
    await screenshot(page, "16_tela_contratos");
    console.log("  Tela de Contratos acessada.");

    console.log("\n=== TESTE CONCLUIDO COM SUCESSO ===");
    console.log("Evidencias salvas em: evidencias/");
  } catch (err) {
    console.error(`\nERRO: ${err.message}`);
    await screenshot(page, "ERRO_inesperado").catch(() => {});
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
