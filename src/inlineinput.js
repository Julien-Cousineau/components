export default function(element){
  console.log(element)
  return element.append('div')
  .attr('class','form-inline')
  .style('margin','5px 0')
  .style('font-size','0.75rem');
};
