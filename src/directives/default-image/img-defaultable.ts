/**
 * Created by loicsalou on 02.07.17.
 */
export interface ImgDefaultable {
  /**
   * get the path to the replacement image when the one foreseen fails 404.
   */
  getDefaultImageSrc(): string;
}
