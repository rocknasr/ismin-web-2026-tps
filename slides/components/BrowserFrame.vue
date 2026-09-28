<script setup lang="ts">
/**
 * Une fenêtre de navigateur, pour montrer ce qu'affiche un bout de HTML ou de JSX.
 *
 *   <BrowserFrame>
 *     <ul><li>Mistral 7B</li></ul>
 *   </BrowserFrame>
 *
 * Pour une capture d'écran, `flush` retire la marge : l'image touche les bords.
 *
 *   <BrowserFrame flush><img src="/medias/capture.png" /></BrowserFrame>
 *
 * Le contenu est rendu avec les styles par défaut d'un navigateur, sans CSS :
 * police à empattements, puces rondes. Pour un titre ou un paragraphe, des
 * <div> avec un style en ligne : le thème des slides restylerait <h1> et <p>.
 */
withDefaults(defineProps<{ url?: string, flush?: boolean }>(), {
  url: 'localhost:5173',
  flush: false,
})
</script>

<template>
  <div class="browser">
    <div class="bar">
      <span class="dot red" />
      <span class="dot yellow" />
      <span class="dot green" />
      <span class="url">{{ url }}</span>
    </div>
    <div class="page" :class="{ flush }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.browser {
  border: 1px solid rgba(128, 128, 128, 0.4);
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(128, 128, 128, 0.1);
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.red { background: #f87171; }
.yellow { background: #facc15; }
.green { background: #4ade80; }

.url {
  margin-left: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  opacity: 0.6;
}

.page {
  padding: 12px 16px;
  font-family: 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.4;
}

.page.flush {
  padding: 0;
  line-height: 0;
}

.page :deep(ul) {
  margin: 0;
  padding-left: 28px;
}

.page :deep(li) {
  list-style-type: disc;
}

.page :deep(button) {
  padding: 1px 6px;
  border: 1px solid #767676;
  border-radius: 3px;
  background: #efefef;
  color: #000;
  font-family: system-ui, sans-serif;
  font-size: 13px;
}
</style>
