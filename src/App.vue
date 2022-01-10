<template>
<ChatHeader/>
<ChatBody/>
<ChatFooter/>
</template>

<script>
import "../src/static/css/chatbot.css"; 
import ChatHeader from './components/ChatHeader.vue'
import ChatBody from './components/ChatBody.vue'
import ChatFooter from './components/ChatFooter.vue'

export default {
  components: {
    ChatHeader,
    ChatBody,
    ChatFooter

  }
}
</script>

<style>

</style>
