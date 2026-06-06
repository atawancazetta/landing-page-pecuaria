/* Lógica de interface: scroll, menu mobile e animações de entrada */

document.addEventListener('DOMContentLoaded', () => {
    // Fixa o cabeçalho e altera o fundo ao rolar a página
    const cabecalho = document.getElementById('cabecalho-principal');
    const scrollThreshold = 80;

    const handleScroll = () => {
        cabecalho.classList.toggle('rolagem', window.scrollY > scrollThreshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Controle do menu mobile e acessibilidade
    const botaoMenu = document.querySelector('.menu-mobile');
    const listaNav = document.querySelector('.menu-navegacao');
    const linksNav = document.querySelectorAll('.menu-navegacao a');

    const toggleMenu = () => {
        const estaAtivo = listaNav.classList.toggle('ativo');
        botaoMenu.setAttribute('aria-expanded', estaAtivo.toString());
        document.body.style.overflow = estaAtivo ? 'hidden' : '';
    };

    botaoMenu.addEventListener('click', toggleMenu);

    linksNav.forEach(link => link.addEventListener('click', () => {
        if (listaNav.classList.contains('ativo')) toggleMenu();
    }));

    // Efeito de escrita dividindo o texto em caracteres individuais
    const animarTexto = (elemento, delayInicial = 0) => {
        const el = typeof elemento === 'string' ? document.getElementById(elemento) : elemento;
        if (!el) return;
        
        const fragmento = document.createDocumentFragment();
        const nodes = Array.from(el.childNodes); 
        el.style.opacity = '1';
        let charIndex = 0;

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Divide o texto em palavras e espaços para manter a integridade das palavras
                const parts = node.textContent.split(/(\s+)/);
                
                parts.forEach(part => {
                    if (/\s/.test(part)) {
                        fragmento.appendChild(document.createTextNode(part));
                        charIndex += part.length;
                    } else if (part.length > 0) {
                        // Se for palavra, envolvemos em um container que impede a separação das letras
                        const wordSpan = document.createElement('span');
                        wordSpan.style.display = 'inline-block';
                        wordSpan.style.whiteSpace = 'nowrap';
                        
                        [...part].forEach(char => {
                            const span = document.createElement('span');
                            span.textContent = char;
                            span.className = 'char';
                            span.style.transitionDelay = `${charIndex * 30}ms`;
                            wordSpan.appendChild(span);
                            charIndex++;
                        });
                        el.appendChild(wordSpan);
                        fragmento.appendChild(wordSpan);
                    }
                });
            } else if (node.nodeName === 'BR') {
                fragmento.appendChild(document.createElement('br'));
            }
        });

        el.innerHTML = ''; 
        el.appendChild(fragmento);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => el.classList.add('revelado'), delayInicial);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(el);
    };

    // Dispara as animações de texto do Hero e títulos de seção
    animarTexto('titulo-hero', 100);
    animarTexto('tagline-hero', 600);

    document.querySelectorAll('.cabecalho-secao h2').forEach(titulo => {
        animarTexto(titulo, 200);
    });

    // Observer para disparar animações conforme o scroll atinge os elementos
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.visibility = 'visible';
                entry.target.classList.add('ativo');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Aplica atraso escalonado (stagger) para itens dentro de grids
    document.querySelectorAll('.revelar-ao-rolar').forEach(el => {
        revealObserver.observe(el);
        
        const parentGrid = el.closest('.grid-caracteristicas, .grade-rebanho');
        if (parentGrid) {
            const siblings = Array.from(parentGrid.querySelectorAll('.revelar-ao-rolar'));
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${index * 120}ms`;
        }
    });

    // Animação de entrada e interação magnética nos ícones sociais
    const listaNavegacao = document.querySelector('.menu-navegacao');
    if (listaNavegacao) {
        const itens = listaNavegacao.querySelectorAll('li');
        itens.forEach((item, index) => {
            item.style.transitionDelay = `${index * 100}ms`;
        });
        setTimeout(() => listaNavegacao.classList.add('visivel'), 100);
    }
    
    // Lógica para marcar item ativo no clique
    linksNav.forEach(link => {
        if (link.classList.contains('link-menu')) {
            link.addEventListener('click', function() {
                linksNav.forEach(l => l.classList.remove('ativo'));
                this.classList.add('ativo');
            });
        }
    });
});