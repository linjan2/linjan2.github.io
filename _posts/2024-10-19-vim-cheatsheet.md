---
title: Vim cheatsheet
categories:
---

# Vim cheatsheet

| Action command      | Description   |
|:--------------------|:--------------|
| `:help [subject]`   | Show help text on subject. E.g. `:help options`, `:help ZQ`, `:help key-notation`. |
| `:show SETTING`     | Show current value of setting. |
| `:source ~/.vimrc`  | Source vimrc file. |
| `ZZ`                | Save and quit (`:wq`). |
| `ZQ`                | Quit without saving (`:q!`). |
| `gg` / `G` / `nG`   | Go to first line / last line / line number `n`. |
| `<C-d>` / `<C-u>`   | Go down/up half a page. |
| `<C-e>` / `<C-y>`   | Scroll down/up without moving cursor (sticks to top/bottom). |
| `zz` / `zt` / `zb`  | Scroll to center the cursor. |
| `ctrl+i` / `ctrl+o` | Go to next/previous jump position. |
| `vip`, `vap`        | Select paragraph about the cursor. `vipip` to select more. |
| `<C-v>{I`           | Insert before lines in block. Can be used to insert comment signs. |
| `V`                 | Select lines. |
| `gv`                | Re-select last last selection. |
| `'.` `1v`           | Go to last edit and re-select the same number of characters/lines. |
| `.`                 | Repeat last action. |
| `/term\c` `n` `N`   | Search for term case-insensitive, go to next, go to previous. `\C` for case-sensitive. |
| `/\%Vterm`           | Search for term in selection. Must be in normal mode, not visual. |
| `:g/regex`          | Search for regex and list results. |
| `:%s/PATTERN/REPLACEMENT/gc` | Search and replace all occurrences. |
| `/term` `cgn` `...` | Search and replace term (one by one). `n` to skip to next term. |
| `:noh[lsearch]`     | Stop highlighting search terms. |
| `/<C-r>"`           | Search for yanked text. |
| `gJ`                | Join line from with below. |
| `:%!clang-format`   | Run command `clang-format` on text. |
| `:'<,'>!awk -f script.awk` | Run command `awk` on visual selection. |
| `:read !date`       | Insert output of command `date`. |
| `:read FILE`        | Insert contents of file `FILE`. |
| `:Lexplore`         | Open netrw in left pane. |
| `<C-w>w`            | Cycle pane focus. |
| `<C-w>l`            | Focus on left pane. |
| `<C-w>\|` / `<C-w>_` | Maximize size of pane width/height. |
| `<C-w>=`            | Equalize sizes of all panes. |
| `<C-w>10>` / `<C-w>-10>` | Increase/decrease pane width by 10 columns. |

```sh
# recover file from swapfile (see :help recovery / :help -r)
vim -r .swp
```

## `~/.vimrc`

```
set exrc      " source .vimrc in project folders
set mouse=    " disable mouse
set list      " show listchars for tabs, trailing, nbsp
set listchars=tab:>>,trail:-,nbsp:+
set number relativenumber " hybrid line numbers (i.e. relative with current line as absolute)
set ignorecase smartcase  " search case-insensitive except when any character if uppercase

set tabstop=4 softtabstop=4 shiftwidth=4 expandtab smarttab
set autoindent         " indent new line as previous line
set formatoptions-=t   " don't auto-wrap text
set formatoptions-=c   " don't auto-wrap comments
set formatoptions-=r   " don't automatically insert comment leader on Enter
set fileencodings=utf-8,latin1 " default file encodings

let g:netrw_banner = 0         " disable banner
let g:netrw_liststyle = 3      " display as tree
let g:netrw_browse_split = 0   " reuse window when opening files
let g:netrw_winsize = 20       " explorer window size percentage

colorscheme slate

" Show file information in status line
set laststatus=2
set statusline=%f%=%y\ %{&fileformat}\ %{&fileencoding==\"\"?&encoding:&fileencoding}\ \ L%l:C%c\ 

set scrolloff=999 " screen lines kept above/below cursor (=999 to keep cursor in middle)

" use Space key as mapleader
nnoremap <space> <nop>
let mapleader=" "
set timeoutlen=2000 " 

nnoremap <leader>m :marks<CR>

" remap shift+tab to de-indent
inoremap <S-Tab> <C-O><<

" show matching parentheses with highlighted foreground, not background
hi MatchParen ctermfg=NONE ctermbg=NONE cterm=bold

" auto-save files under home
augroup AUTOSAVE
    autocmd!
    autocmd TextChanged,InsertLeave,FocusLost ~/* if &readonly == 0 && filereadable(bufname('%')) | silent update | endif
augroup END

" remove autosave if environment variable
if $VIM_AUTOSAVE=="no"
    au! AUTOSAVE
endif
```

### Auto-complete parentheses

```
" auto-complete parentheses
inoremap {<space> {}<left>
inoremap (<space> ()<left>
inoremap [<space> []<left>
inoremap "<space> ""<left>
inoremap '<space> ''<left>
" except when completing manually
inoremap {} {}
inoremap () ()
inoremap [] []
inoremap "" ""
" auto-add closing bracket after enter
inoremap {<CR> {<CR>}<up><CR>
```

## `~/.vim/colors/custom.vim`

```
set background=dark

" clear highlighting
hi clear
if exists("syntax_on")
    syntax reset
endif

"set t_Co=256
let g:colors_name = "simple"

"hi CTagsClass           -- no settings --
"hi CTagsGlobalConstant  -- no settings --
"hi CTagsGlobalVariable  -- no settings --
"hi CTagsImport          -- no settings --
"hi CTagsMember          -- no settings --
"hi DefinedName          -- no settings --
"hi EnumerationName      -- no settings --
"hi EnumerationValue     -- no settings --
"hi FoldColumn           -- no settings --
"hi Ignore               -- no settings --
"hi LocalVariable        -- no settings --
"hi ModeMsg              -- no settings --
"hi MoreMsg              -- no settings --
"hi Question             -- no settings --
"hi SpellBad             -- no settings --
"hi SpellCap             -- no settings --
"hi SpellLocal           -- no settings --
"hi SpellRare            -- no settings --
"hi StatusLine           -- no settings --
"hi StatusLineNC         -- no settings --
"hi Union                -- no settings --
"hi VisualNOS            -- no settings --
"hi WarningMsg           -- no settings --
"hi clear                -- no settings --

 
" http://vimdoc.sourceforge.net/htmldoc/syntax.html#:highlight
hi Normal                ctermfg=15    ctermbg=0     cterm=NONE       guifg=#000000 guibg=#ffffff gui=NONE

hi Boolean               ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#ff0000 guibg=NONE gui=NONE
hi Character             ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi Comment               ctermfg=7     ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi Conditional           ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Constant              ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi CursorColumn          ctermfg=NONE  ctermbg=NONE  cterm=underline  guifg=NONE guibg=NONE gui=NONE
hi CursorLine            ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi CursorLineNr          ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi ColorColumn           ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=NONE guibg=#dddddd gui=NONE
hi Debug                 ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi Define                ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi Delimiter             ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi DiffAdd               ctermfg=10    ctermbg=NONE  cterm=NONE       guifg=#00ff00 guibg=NONE gui=NONE
hi DiffChange            ctermfg=12    ctermbg=NONE  cterm=NONE       guifg=#0000ff guibg=NONE gui=NONE
hi DiffDelete            ctermfg=9     ctermbg=NONE  cterm=NONE       guifg=#ff0000 guibg=NONE gui=NONE
hi DiffText              ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi Directory             ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Error                 ctermfg=1     ctermbg=NONE  cterm=NONE       guifg=#ff0000 guibg=NONE gui=NONE
hi ErrorMsg              ctermfg=1     ctermbg=NONE  cterm=NONE       guifg=#ff0000 guibg=NONE gui=NONE
hi Exception             ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=italic
hi Float                 ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi Folded                ctermfg=NONE  ctermbg=8     cterm=bold       guifg=NONE guibg=#cccccc gui=NONE
hi Function              ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi HighlightedyankRegion ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=italic
hi htmltagname           ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi Identifier            ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi IncSearch             ctermfg=NONE  ctermbg=NONE  cterm=inverse,bold guifg=NONE guibg=NONE gui=inverse,italic
hi Include               ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Keyword               ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Label                 ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi LineNr                ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi Macro                 ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi MatchParen            ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=bold
hi ModeMsg               ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi NonText               ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi Number                ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi Operator              ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi PMenu                 ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi PMenuSbar             ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi PMenuSel              ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi PMenuThumb            ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi PreCondit             ctermfg=6     ctermbg=NONE  cterm=NONE       guifg=#16b723 guibg=NONE gui=NONE
hi PreProc               ctermfg=5     ctermbg=NONE  cterm=NONE       guifg=#333333 guibg=NONE gui=NONE
hi pythonescape          ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi Repeat                ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Search                ctermfg=NONE  ctermbg=NONE  cterm=inverse    guifg=NONE guibg=NONE gui=inverse
hi SignColumn            ctermfg=NONE  ctermbg=NONE  cterm=inverse    guifg=NONE guibg=NONE gui=inverse
hi Special               ctermfg=2     ctermbg=NONE  cterm=bold       guifg=#2323ce guibg=NONE gui=bold
hi SpecialChar           ctermfg=2     ctermbg=NONE  cterm=bold       guifg=#2323ce guibg=NONE gui=bold
hi SpecialComment        ctermfg=2     ctermbg=NONE  cterm=bold       guifg=#2323ce guibg=NONE gui=bold
hi SpecialKey            ctermfg=8     ctermbg=NONE  cterm=bold       guifg=#666666 guibg=NONE gui=bold
hi Statement             ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi StatusLine            ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=#666666 guibg=NONE gui=NONE
hi StatusLineNC          ctermfg=8     ctermbg=NONE  cterm=NONE       guifg=#333333 guibg=NONE gui=NONE
hi StorageClass          ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi String                ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
hi Structure             ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi TabLine               ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=NONE
hi TabLineFill           ctermfg=NONE  ctermbg=8     cterm=NONE       guifg=NONE guibg=#666666 gui=NONE
hi TabLineSel            ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Tag                   ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=NONE guibg=NONE gui=underline
hi Title                 ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=NONE
hi Todo                  ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Type                  ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Typedef               ctermfg=NONE  ctermbg=NONE  cterm=bold       guifg=NONE guibg=NONE gui=bold
hi Underlined            ctermfg=NONE  ctermbg=NONE  cterm=underline  guifg=NONE guibg=NONE gui=underline
hi VertSplit             ctermfg=NONE  ctermbg=NONE  cterm=NONE       guifg=#333333 guibg=NONE gui=NONE
hi Visual                ctermfg=NONE  ctermbg=NONE  cterm=inverse    guifg=NONE guibg=NONE gui=inverse
hi WildMenu              ctermfg=2     ctermbg=NONE  cterm=NONE       guifg=#2323ce guibg=NONE gui=NONE
```

Check current value with e.g. `:highlight Comment`.

## Re-orders lines

```
dd          Delete (and yank) the lines in the order they should be in
:display    Display registers
"1P         Paste from register 1 above current line
.           Repeat the paste action while updating register 1 to the next register
```


