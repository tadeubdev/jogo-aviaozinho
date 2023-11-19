<?php

// lista todos os arquivos de todos os diretórios exceto os que estão no array $excluir
// e printa um array javascript na tela para ser usado no service-worker.js

$excluir = [
  'lista-arquivos.php', 'service-worker.js', '.vscode', 'node_modules',
  'package.json', 'package-lock.json', 'README.md', 'sw.js',
  '.editorconfig', '.gitignore',
];

$files = glob('{,./*,*/*,*/*/*,*/*/*/*,*/*/*/*/*,*/*/*/*/*/*,*/*/*/*/*/*/*,*/*/*/*/*/*/*/*,*/*/*/*/*/*/*/*/*}', GLOB_BRACE);

$files = array_filter($files, function ($file) use ($excluir) {
  return !in_array(basename($file), $excluir);
});

$files = array_map(function ($file) {
  return "'$file'";
}, $files);

echo '[' . implode(',', $files) . ']';
