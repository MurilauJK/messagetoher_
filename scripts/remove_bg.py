"""
Remove o fundo de uma imagem e salva como PNG com transparência.
Uso: python remove_bg.py [caminho_da_imagem]
Requer: pip install rembg pillow
"""

import sys
import os

def main():
    if len(sys.argv) < 2:
        print("Uso: python remove_bg.py <imagem_entrada> [imagem_saida.png]")
        sys.exit(1)

    input_path = sys.argv[1]
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        base, ext = os.path.splitext(input_path)
        output_path = f"{base}_sem_fundo.png"

    if not os.path.isfile(input_path):
        print(f"Arquivo não encontrado: {input_path}")
        sys.exit(1)

    try:
        from rembg import remove
        from PIL import Image
    except ImportError:
        print("Instale as dependências: pip install rembg pillow")
        sys.exit(1)

    print(f"Abrindo {input_path}...")
    with open(input_path, "rb") as f:
        input_data = f.read()

    print("Removendo fundo (pode demorar na primeira vez)...")
    output_data = remove(input_data)

    print(f"Salvando em {output_path}...")
    with open(output_path, "wb") as f:
        f.write(output_data)

    print("Pronto!")

if __name__ == "__main__":
    main()
