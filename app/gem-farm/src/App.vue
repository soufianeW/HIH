<template>
<body>
  <div class="relative h-full min-h-screen">
    <TheNavBar />
    <div class="p-10">
      <router-view />
    </div>

    <div class="go"><Music /></div>
    <TheCat />
    <TheFooter />
  </div>
</body> 
</template>

<script>
  import TheNavBar from '@/components/TheNavBar';
  import Music from '@/components/Music';
  import TheCat from '@/components/gem-farm/TheCat';
  export default {
    components: { TheNavBar , Music },
  };  



</script>

<style>
.go{
  position : sticky;
  bottom : 20px;
  left : 1600px;
  width: 65px;
}
body{
  background-image: url('../src/assets/backk.png');
  background-size: cover;
}
* {
  font-family: 'Press Start 2P', monospace;
}
input[type='radio']:checked + span {
  @apply text-black;
}

</style>
