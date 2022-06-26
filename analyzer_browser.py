from js import document
from pyodide import create_proxy
from tokenizer import Tokenizer
from compilation_engine import CompilationEngine

def analyze(event) -> None:
    jack_text = document.getElementById("jackTextArea").value

    tokenizer = Tokenizer(jack_text)
    compilation_engine = CompilationEngine(tokenizer)

    # run tokenizer
    while tokenizer.has_more_tokens():
        token, token_type = tokenizer.advance()
        if token_type == 'stringConstant':
            token = tokenizer.string_val()

        tokenizer.write_token_tag(token_type, token)

    # Reinitialize current_token_index
    tokenizer.current_token_index = -1

    # run compilation engine
    while tokenizer.has_more_tokens():
        token, token_type = tokenizer.advance()

        if token == 'class':
            compilation_engine.compile_class(token, token_type)

    parsed_xml_str = compilation_engine.get_xml_str()

    xml_text = document.getElementById("xmlText")
    xml_text.innerText = parsed_xml_str


def setup() -> None:
    click_proxy = create_proxy(analyze)
    parseButton = document.getElementById("parseButton")
    parseButton.addEventListener("click", click_proxy)


setup()
